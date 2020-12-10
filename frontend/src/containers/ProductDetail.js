import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Loader,
  Message,
  Segment,
  Select,
} from "semantic-ui-react";

import { productDetailURL, addToCartURL } from "./constants";

import { authAxios } from "../Utils";

import { fetchCart } from "../store/actions/Cart";

class ProductDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
  };

  componentDidMount() {
    this.handleFetchItem();
  }

  handleFetchItem = () => {
    const {
      match: { params },
    } = this.props;
    this.setState({ loading: true });
    axios
      .get(productDetailURL(params.productID))
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .then((res) => {
        this.props.history.push("/order-summary");
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    this.setState({ formData: updatedFormData });
  };

  render() {
    const { data, error, loading } = this.state;
    const item = data;
    return (
      <Container>
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
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Card
                fluid
                image={item.image}
                header={item.title}
                meta={<React.Fragment>{item.category}</React.Fragment>}
                description={item.description}
                extra={
                  <React.Fragment>
                    <Button
                      fluid
                      color="yellow"
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      Add to cart.
                      <Icon name="cart plus" />
                    </Button>
                  </React.Fragment>
                }
              />
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};
export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
