import httpRequest from "../utils/httpRequest";

const qrVerificationService = {
  getQRVerificationLink: (data) => {
    return httpRequest.post("verify-identity", data);
  },

  checkForVerification: (params) => {
    return httpRequest.get("verify-identity", {params});
  },
};

export default qrVerificationService;
