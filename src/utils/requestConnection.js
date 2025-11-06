import axios from "axios";
import { handleError } from "./errorHandler";
import { showAlert } from "../store/alert/alert.thunk";
import { store } from "../store";
export const baseURL = "https://api.auth.u-code.io";

const requestAuthV2NoEnv = axios.create({
  baseURL,
  timeout: 100000,
});

const errorHandler = (error, hooks) => {
  console.log("error", error);
  if (error?.response) {
    if (error.response?.data?.data) {
      handleError(error?.response?.data?.data);
      // store.dispatch(
      //   showAlert(
      //     error.response.data.data?.replace(
      //       "rpc error: code = InvalidArgument desc = ",
      //       ""
      //     )
      //   )
      // );
    }

    if (error?.response?.status === 403) {
    } else if (error?.response?.status === 401) {
      // store.dispatch(logout())
    }
  }
  // isOnline?.isOnline &&
  else store.dispatch(showAlert("No connection to the server, try again"));

  return Promise.reject(error.response);
};

requestAuthV2NoEnv.interceptors.request.use(
  (config) => {
    const authStore = store?.getState()?.auth;
    const token = authStore?.token;

    const resourceId = "7317bea3-7069-45ef-b48b-d61f235992a9";
    const projectId = "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1";

    config.headers["resource-id"] = resourceId;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["resource-id"] = resourceId;
    }

    if (!config.params?.["project-id"]) {
      if (config.params) {
        config.params["project-id"] = projectId;
      } else {
        config.params = {
          "project-id": projectId,
        };
      }
    }
    return config;
  },

  (error) => errorHandler(error),
);

requestAuthV2NoEnv.interceptors.response.use(
  (response) => response.data.data,
  errorHandler,
);

export default requestAuthV2NoEnv;
