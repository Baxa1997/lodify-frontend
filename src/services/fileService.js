import httpRequest from "@utils/httpRequest";

const fileService = {
  upload: (data, params) => httpRequest.post("v1/upload", data, {params}),
  folderUpload: (data, params) =>
    httpRequest.post("/v1/files/folder_upload", data, {params}),

  //   getMinioList: (params) => requestWithoutProjectId.get(`/v1/files`, {params}),
  //   delete: (data) => requestWithoutProjectId.delete(`/v1/files`, {data}),
  //   fileDelete: (id) => requestWithoutProjectId.delete(`/v1/files/${id}`),
  //   update: (data) => requestWithoutProjectId.put(`/v1/files`, data),
  //   getByID: (params, fileId) => {
  //     return requestWithoutProjectId.get(`/v1/files/${fileId}`, {
  //       params,
  //     });
  //   },
};

export default fileService;
