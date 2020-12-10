import {
  ADDRESS_START,
  ADDRESS_SUCCESS,
  ADDRESS_FAIL,
} from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  addressList: [],
  error: null,
  loading: false,
};

const addressStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const addressSuccess = (state, action) => {
  return updateObject(state, {
    addressList: action.data,
    error: null,
    loading: false,
  });
};

const addressFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADDRESS_START:
      return addressStart(state, action);
    case ADDRESS_SUCCESS:
      return addressSuccess(state, action);
    case ADDRESS_FAIL:
      return addressFail(state, action);
    default:
      return state;
  }
};

export default reducer;
