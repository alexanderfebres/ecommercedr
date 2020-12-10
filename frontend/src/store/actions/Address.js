import { ADDRESS_START, ADDRESS_SUCCESS, ADDRESS_FAIL } from "./actionTypes";

import { authAxios } from "../../Utils";
import { addressListURL } from "../../containers/constants";

export const addressStart = () => {
  return {
    type: ADDRESS_START,
  };
};

export const addressSuccess = (data) => {
  return {
    type: ADDRESS_SUCCESS,
    data,
  };
};

export const addressFail = (error) => {
  return {
    type: ADDRESS_FAIL,
    error: error,
  };
};

export const fetchAddresses = (addressType) => {
  return (dispatch) => {
    dispatch(addressStart());
    authAxios
      .get(addressListURL(addressType))
      .then((res) => {
        dispatch(addressSuccess(res.data));
      })
      .catch((err) => {
        dispatch(addressFail(err));
      });
  };
};
