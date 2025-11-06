import axios from "axios";
import { store } from "../store";
import { authActions } from "../store/auth/auth.slice";
import authService from "../services/auth/authService";
import { handleError } from "./errorHandler";
import { showAlert } from "../store/alert/alert.thunk";
export const baseURL = "https://api.auth.u-code.io/";

const requestAuth = axios.create({
  baseURL,
  timeout: 100000,
});

const errorHandler = (error, hooks) => {
  console.log("error", error);
  if (
    error?.response?.status === 401 &&
    error?.response?.data?.data ===
      "rpc error: code = Unavailable desc = User not access environment"
  ) {
    store.dispatch(authActions.logout());
  } else if (error?.response?.status === 401) {
    const refreshToken = store.getState().auth.refreshToken;

    const params = {
      refresh_token: refreshToken,
    };

    const originalRequest = error.config;

    return authService
      .refreshToken(params)
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        store.dispatch(authActions.setPermission(res));
        return request(originalRequest);
      })
      .catch((err) => {
        console.log(err);
        store.dispatch(authActions.logout());
        return Promise.reject(error);
      });
  } else {
    if (error?.response) {
      if (error.response?.data?.data) {
        if (
          error.response.data.data !==
          "rpc error: code = Internal desc = member group is required to add new member"
        ) {
          handleError(error?.response?.data?.data);
        }
      }
      if (error?.response?.status === 403) {
        handleError(error?.response?.data?.data);
      }
    } else store.dispatch(showAlert("No connection to the server, try again"));

    return Promise.reject(error.response);
  }
};

const customMessageHandler = (res) => {
  if (res.data.custom_message?.length && res.status < 400) {
    store.dispatch(showAlert(res.data.custom_message, "success"));
  } else if (res.data.custom_message?.length) {
    handleError(res.data.custom_message);
  }
};

requestAuth.interceptors.request.use(
  (config) => {
    const resourceId = "7317bea3-7069-45ef-b48b-d61f235992a9";
    const environmentId = "96c90ef2-f20c-4761-bf2d-ba131ddc11be";
    const projectId = "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1";

    const authStore = store?.getState()?.auth;
    const token = authStore?.token;

    config.headers["environment-id"] = environmentId;
    config.headers["resource-id"] = resourceId;

    return config;
  },

  (error) => errorHandler(error),
);

requestAuth.interceptors.response.use((response) => {
  customMessageHandler(response);
  return response.data.data;
}, errorHandler);

export default requestAuth;
