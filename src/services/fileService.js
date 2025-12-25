import httpRequest from "@utils/httpRequest";

const fileService = {
  upload: (data, params) => httpRequest.post("v1/upload", data, {params}),
  folderUpload: (data, params) =>
    httpRequest.post("/v1/files/folder_upload", data, {params}),
};

export default fileService;
