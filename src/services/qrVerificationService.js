import httpRequest from "../utils/httpRequest";

const qrVerificationService = {
  getQRVerificationLink: (data) =>
    httpRequest.post("v2/invoke_function/lodify-integrations", data),

  checkForVerification: (data) => {
    const dataParam = JSON.stringify(data);
    return httpRequest.get(
      `v2/items/sessions?data=${encodeURIComponent(dataParam)}`
    );
  },
};

export default qrVerificationService;
