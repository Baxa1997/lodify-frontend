import httpRequest from "../utils/httpRequest";

const clientsService = {
  getListShipper: () => {
    return httpRequest.get("v2/items/shippers");
  },
  getListRepresentative: () => {
    return httpRequest.get("v2/items/representative");
  },

  createShipper: (data) => {
    return httpRequest.post("v2/items/shippers", data);
  },

  createRepresentative: (data) => {
    return httpRequest.post("v2/items/representative", data);
  },

  getSingleRepresentative: (id) => {
    return httpRequest.get(`v1/object-slim/representative/${id}`);
  },

  updateRepresentative: (data) => {
    return httpRequest.put("v2/items/representative", data);
  },

  getSingleShipper: (id) => {
    return httpRequest.get(`v1/object-slim/shippers/${id}`);
  },

  updateShipper: (data) => {
    return httpRequest.put("v2/items/shippers", data);
  },

  deleteShipper: (id) => {
    return httpRequest.delete(`v2/items/shippers/${id}`, {
      data: {
        data: {},
      },
    });
  },

  deleteRepresentative: (id) => {
    return httpRequest.delete(`v2/items/representative/${id}`, {
      data: {
        data: {},
      },
    });
  },
};

export default clientsService;
