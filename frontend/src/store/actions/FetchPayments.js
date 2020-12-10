import {
  FETCH_PAYMENTS_START,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_FAIL,
} from "../actions/actionTypes";

import { authAxios } from "../../Utils";
import { paymentListURL } from "../../containers/constants";

export const fetchPaymentsStart = () => {
  return {
    type: FETCH_PAYMENT_START,
  };
};

export const fetchPaymentsSuccess = (data) => {
  return {
    type: FETCH_PAYMENTS_SUCCESS,
    data: res.data,
  };
};

export const fetchPaymentsFail = (error) => {
  return {
    type: FETCH_PAYMENTS_FAIL,
    error: error,
  };
};

export const handleFetchPayements = () => {
  return (dispatch) => {
    dispatch(fetchPaymentsStart());
    authAxios
      .get(paymentListURL)
      .then((res) => {
        dispatch(fetchPaymentsSuccess(res.data));
      })
      .catch((err) => {
        dispatch(fetchPaymentsFail(err));
      });
  };
};
