import React from "react";
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import { Link, withRouter } from "react-router-dom";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import {
  Button,
  Container,
  Divider,
  Dimmer,
  Header,
  Item,
  Image,
  Label,
  Loader,
  Message,
  Segment,
  Form,
} from "semantic-ui-react";

import {
  checkoutURL,
  orderSummaryURL,
  addCouponURL,
  addressListURL,
} from "../containers/constants";

import { authAxios } from "../Utils";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_ID);
// const stripePromise = loadStripe(
//   "pk_test_51Ha0vNGV70HGHFAGYq6tdL9DjEXnL6uslIYoVA7TLvwLhW1EHWUWiMh0KM4PEkxkzCsy6Y0mbkjAdXCBzlPzJVbx00Mtss3kPN"
// );

const OrderPreview = (props) => {
  const { data } = props;

  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <Item.Group relaxed>
            {data.order_items.map((order_item, i) => {
              return (
                <Item key={i}>
                  <Item.Image size="tiny" src={order_item.item.image} />

                  <Item.Content verticalAlign="middle">
                    <Item.Header as="a">
                      {order_item.quantity} x {order_item.item.title}
                    </Item.Header>

                    <Item.Extra>
                      <Label>$ {order_item.final_price}</Label>
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>

          <Item.Group>
            <Item.Content>
              <Item.Header>
                Order Total: ${data.total}
                {data.coupon && (
                  <Label color="green" style={{ marginLeft: "15px" }}>
                    Current Coupon: {data.coupon.code} for ${data.coupon.amount}
                  </Label>
                )}
              </Item.Header>
            </Item.Content>
          </Item.Group>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

class CouponForm extends React.Component {
  state = {
    code: "",
  };

  handleChange = (e) => {
    this.setState({ code: e.target.value });
  };

  handleSubmit = (e) => {
    const { code } = this.state;
    this.props.handleAddCoupon(e, code);
    this.setState({ code: "" });
  };

  render() {
    const { code } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Coupong Code</label>
            <input
              placeholder="Enter a coupon"
              value={code}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}

class CheckoutForm extends React.Component {
  state = {
    loading: true,
    error: null,
    success: false,
    data: null,
    billing: [],
    shipping: [],
  };

  componentDidMount() {
    this.handleFetchOrder();
  }

  handleFetchBillingAddress = () => {
    authAxios
      .get(addressListURL("B"))
      .then((res) => {
        this.setState({ billing: res.data });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchShippingAddress = () => {
    authAxios
      .get(addressListURL("S"))
      .then((res) => {
        this.setState({ shipping: res.data });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
        this.handleFetchBillingAddress();
        this.handleFetchShippingAddress();
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.props.history.push("/");
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };
  handleAddCoupon = (e, code) => {
    this.setState({ loading: true });

    authAxios
      .post(addCouponURL, { code })
      .then((res) => {
        this.setState({ loading: false });
        this.handleFetchOrder();
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    this.setState({ loading: true });
    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    authAxios
      .post(checkoutURL, { stripeToken: paymentMethod.card })
      .then((res) => {
        this.setState({ loading: false, success: true });
      })
      .catch((err) => {
        this.setState({ loading: false, error: err });
      });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }
  };

  render() {
    const { stripe } = this.props;
    const { data, error, loading, success, shipping, billing } = this.state;

    return (
      <div>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        {success && (
          <Message positive>
            <Message.Header>Your payment was successful</Message.Header>
            <p>
              Go to you <b>profile</b> to see the order delivery status.
            </p>
          </Message>
        )}
        <OrderPreview data={data} />
        <Divider />
        <CouponForm
          handleAddCoupon={(e, code) => this.handleAddCoupon(e, code)}
        />
        <Divider />

        {billing.length >= 1 && shipping.length >= 1 ? (
          <div>
            <Header>Would you like to complete the purchase ?</Header>

            <form onSubmit={this.handleSubmit}>
              <CardElement />

              <Button
                secondary
                type="submit"
                disabled={!stripe}
                style={{ marginTop: "10px" }}
              >
                Pay
              </Button>
            </form>
          </div>
        ) : (
          <div>
            {" "}
            <Header as="h5">
              <Link to="/profile">
                Please go to your profile and provide your addresses..
              </Link>
            </Header>
          </div>
        )}
      </div>
    );
  }
}

const InjectedCheckoutForm = () => {
  return (
    <Container text>
      <h3>Complete your Order</h3>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <CheckoutForm elements={elements} stripe={stripe} />
          )}
        </ElementsConsumer>
      </Elements>
    </Container>
  );
};

export default withRouter(InjectedCheckoutForm);
