import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Dimmer,
  Divider,
  Grid,
  Header,
  Image,
  Label,
  Loader,
  Menu,
  Message,
  Segment,
} from "semantic-ui-react";
import { countryListURL, addressDeleteURL, userIDURL } from "./constants";
import { authAxios } from "../Utils";
import { fetchAddresses } from "../store/actions/Address";

import PaymentHistory from "./PaymentHistory";
import AddressForm from "./AddressForm";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

let globalActiveItem = "billingAddress";

class Profile extends React.Component {
  state = {
    activeItem: "billingAddress",
    addresses: [],
    countries: [],
    userID: null,
    selectedAddress: null,
  };

  componentDidMount() {
    this.props.fetchAddresses();
    this.handleFetchCountries();
    this.handleFetchUserID();
  }

  handleItemClick = (name) => {
    this.setState({ activeItem: name }, () => {
      globalActiveItem = this.state.activeItem;
      this.props.fetchAddresses();
    });
  };

  handleGetActiveItem = () => {
    const { activeItem } = this.state;
    if (activeItem === "billingAddress") {
      return "Billing Address";
    } else if (activeItem === "shippingAddress") {
      return "Shipping Address";
    }
    return "Payment History";
  };

  handleFormatCountries = (countries) => {
    const keys = Object.keys(countries);
    return keys.map((k) => {
      return {
        key: k,
        text: countries[k],
        value: k,
      };
    });
  };

  handleDeleteAddress = (addressID) => {
    authAxios
      .delete(addressDeleteURL(addressID))
      .then((res) => {
        this.handleCallback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleSelectAddress = (address) => {
    this.setState({ selectedAddress: address });
  };

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        this.setState({ userID: res.data.userID });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchCountries = () => {
    authAxios
      .get(countryListURL)
      .then((res) => {
        this.setState({ countries: this.handleFormatCountries(res.data) });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.props.fetchAddresses();
    this.setState({ selectedAddress: null });
  };

  renderAddresses = () => {
    const {
      activeItem,
      addresses,
      countries,
      selectedAddress,
      userID,
    } = this.state;
    return (
      <React.Fragment>
        <Card.Group>
          {this.props.addressesList.map((a) => {
            return (
              <Card key={a.id}>
                <Card.Content>
                  {a.default && (
                    <Label as="a" color="blue" ribbon="right">
                      Default
                    </Label>
                  )}
                  <Card.Header>
                    {a.street_address}, {a.apartment_address}
                  </Card.Header>
                  <Card.Meta>{a.country}</Card.Meta>
                  <Card.Description>{a.zip}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="yellow"
                    onClick={() => this.handleSelectAddress(a)}
                  >
                    Update
                  </Button>
                  <Button
                    color="red"
                    onClick={() => this.handleDeleteAddress(a.id)}
                  >
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
        {addresses.length > 0 ? <Divider /> : null}
        {selectedAddress === null ? (
          <AddressForm
            activeItem={activeItem}
            countries={countries}
            formType={CREATE_FORM}
            userID={userID}
            callback={this.handleCallback}
          />
        ) : null}
        {selectedAddress && (
          <AddressForm
            activeItem={activeItem}
            userID={userID}
            countries={countries}
            address={selectedAddress}
            formType={UPDATE_FORM}
            callback={this.handleCallback}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const { activeItem, error, loading } = this.state;
    const { isAuthenticated } = this.props;
    const { token } = this.props;

    if (!isAuthenticated) {
      this.props.history.push("/login");
    }
    return (
      <Grid container columns={2} divided>
        <Grid.Row columns={1}>
          <Grid.Column>
            {error && (
              <Message
                error
                header="There was an error"
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
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            <Menu pointing vertical fluid>
              <Menu.Item
                name="Billing Address"
                active={activeItem === "billingAddress"}
                onClick={() => this.handleItemClick("billingAddress")}
              />
              <Menu.Item
                name="Shipping Address"
                active={activeItem === "shippingAddress"}
                onClick={() => this.handleItemClick("shippingAddress")}
              />
              <Menu.Item
                name="Payment history"
                active={activeItem === "paymentHistory"}
                onClick={() => this.handleItemClick("paymentHistory")}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header>{this.handleGetActiveItem()}</Header>
            <Divider />
            {activeItem === "paymentHistory" ? (
              <PaymentHistory />
            ) : (
              this.renderAddresses()
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    addressesList: state.address.addressList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAddresses: () =>
      dispatch(
        fetchAddresses(globalActiveItem === "billingAddress" ? "B" : "S")
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
