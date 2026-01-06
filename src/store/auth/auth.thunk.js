import {createAsyncThunk} from "@reduxjs/toolkit";
import authService from "../../services/auth/authService";
import {authActions} from "./auth.slice";
import {store} from "..";
import {companyActions} from "../company/company.slice";

const getCarrierStatus = (companies_id) => {
  authService
    .getCarrierStatus({
      data: {
        method: "update",
        object_data: {
          companies_id: companies_id,
          setup_skip: true,
        },
        table: "company",
      },
    })
    .then((res) => {
      localStorage.setItem("carrierStatus", res?.data?.response?.setup_skip);
    });
};

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data, {dispatch}) => {
    try {
      const res = await authService.login(data);
      dispatch(
        authActions.loginSuccess({
          ...res,
          project_id: data.project_id,
          environment_ids: data?.environment_ids,
          ip_address: data?.ip_address,
        })
      );

      if (Boolean(!res?.user_data?.brokers_id)) {
        getCarrierStatus(res?.user_data?.companies_id);
      }

      dispatch(companyActions.setCompanyId(res?.user?.company_id));
      dispatch(companyActions.setProjectId(data.project_id));
      dispatch(companyActions.setEnvironmentId(res?.environment_id));
      dispatch(companyActions.setDefaultPage(data?.default_page));
      // dispatch(permissionsActions.setPermissions(res?.permissions));
      // dispatch(permissionsActions.setGlobalPermissions(res?.global_permission));

      await authService
        .updateToken(
          {
            refresh_token: res.token.access_token,
            env_id: res.environment_id,
            project_id:
              data.project_id || "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
          },
          {
            project_id:
              data.project_id || "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
          }
        )
        .then((res) => {
          store.dispatch(authActions.setTokens(res));
        })
        .catch((err) => {
          console.log(err);
        });

      try {
        const ipAddress = data?.ip_address;
        const userGuid = res?.user?.guid || res?.user_data?.guid;

        if (
          ipAddress &&
          userGuid &&
          data?.client_type !== "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
        ) {
          await authService.updateUserIpAddress({
            data: {
              ip_address: ipAddress,
              guid: userGuid,
            },
          });
        }
      } catch (ipError) {
        console.error("Error updating user IP address:", ipError);
      }

      const fcmToken = localStorage.getItem("fcmToken");
      if (res.user.id)
        await authService.sendFcmToken({
          token: fcmToken,
          user_id: res.user.id,
          platform_id: "ANDROID",
        });

      // dispatch(cashboxActions.setData(cashboxData))
    } catch (error) {
      throw new Error(error);
      // dispatch(showAlert('Username or password is incorrect'))
    }
  }
);
