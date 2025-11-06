import requestAuth from "../../utils/requestAuth";
import requestV2 from "../../utils/requestV2";
import httpRequest from "../../utils/httpRequest";

const authService = {
  login: (data) =>
    requestV2.post("v2/login", data, {
      headers: {"environment-id": data.environment_id},
    }),
  register: (data) => {
    const payload = {
      data: {
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: "0b7d0ea1-43af-42b3-92fa-829c497a14f9",
        method: "register",
        object_data: data,
        table: "user",
      },
    };

    return httpRequest.post("v2/invoke_function/lodify-integrations", payload, {
      headers: {
        "X-API-KEY": "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        authorization: "API-KEY",
        "Content-Type": "application/json",
      },
    });
  },
  multiCompanyLogin: (data, params) =>
    requestAuth.post("v2/multi-company/login", data, {params}),
  refreshToken: (data, params) => requestV2.put("v2/refresh", data, {params}),
  updateToken: (data, params) => requestV2.put("v2/refresh", data, {params}),
  verifyCode: (sms_id, data, params) =>
    requestAuth.post(`v2/auth/verify/${sms_id}`, data, {params}),
  sendAccessToken: (data) => requestAuth.post("v2/auth/logout", data),
  sendCode: (data, params) => requestAuth.post("v2/send-code", data, {params}),
  verifyPhoneCode: (verify_id, data, params) =>
    requestAuth.post(`v2/auth/verify/${verify_id}`, data, {params}),
  getRoles: (params, headers) => requestAuth.get("v2/role", {params, headers}),
  getRoleById: (projectId, roleId, params) =>
    requestAuth.get(`v2/role-permission/detailed/${projectId}/${roleId}`, {
      params,
    }),
  updatePermissions: (data, params) =>
    requestAuth.put("v2/role-permission/detailed", {data}, {params}),
  roleCreate: (data, params) => requestAuth.post("v2/role", data, {params}),
};

export default authService;
