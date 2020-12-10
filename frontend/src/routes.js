import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import ProductList from "./containers/ProductList";
import ProductDetail from "./containers/ProductDetail";
import OrderSummary from "./containers/OrderSummary";
import CheckoutForm from "./containers/Checkout";
import Profile from "./containers/Profile";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/" component={ProductList} />
    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:productID" component={ProductDetail} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/checkout" component={CheckoutForm} />
    <Route path="/profile" component={Profile} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
  </Hoc>
);

export default BaseRouter;
