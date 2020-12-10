import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  Container,
  Dimmer,
  Image,
  Item,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react";

import { productListURL, addToCartURL } from "./constants";

import { authAxios } from "../Utils";

import { fetchCart } from "../store/actions/Cart";

class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.fetchCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;
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
              <Loader inverted> Loading </Loader>
            </Dimmer>
            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <Item.Group divided>
          {data.map((item) => {
            return (
              <Item key={item.id}>
                <Item.Image src={item.image} />
                <Item.Content>
                  <Item.Header
                    loading={loading}
                    as="a"
                    onClick={() => {
                      this.props.history.push(`/products/${item.id}`);
                      window.location.reload(true);
                    }}
                  >
                    {item.title}
                  </Item.Header>
                  <Item.Meta>
                    <span className="cinema"> {item.category} </span>
                  </Item.Meta>
                  <Item.Description> {item.description} </Item.Description>
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group>
      </Container>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};
export default connect(null, mapDispatchToProps)(ProductList);
