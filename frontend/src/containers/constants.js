const apiHost = process.env.REACT_APP_API_HOST;
// const apiHost = "https://ecommercedrback.herokuapp.com";

const apiURL = "/api";

export const endpoint = `${apiHost}${apiURL}`;

export const loginURL = `${apiHost}/rest-auth/login/`;
export const signupURL = `${apiHost}/rest-auth/registration/`;
export const productListURL = `${endpoint}/products/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const paymentListURL = `${endpoint}/payments/`;
export const userIDURL = `${endpoint}/user-id/`;
export const countryListURL = `${endpoint}/countries/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;
export const addressCreateURL = `${endpoint}/address/create/`;
export const productDetailURL = (id) => `${endpoint}/products/${id}/`;
export const addressUpdateURL = (id) => `${endpoint}/address/${id}/update/`;
export const addressDeleteURL = (id) => `${endpoint}/address/${id}/delete/`;
export const orderItemDeleteURL = (id) =>
  `${endpoint}/order-item/${id}/delete/`;
export const addressListURL = (addressType) =>
  `${endpoint}/addresses/?address_type=${addressType}`;
