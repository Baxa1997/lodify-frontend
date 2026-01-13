import httpRequest from "../utils/httpRequest";

const usersService = {
  getList: (params = {}, path = "") => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/${path}?data=${encodeURIComponent(dataParam)}`
    );
  },
  getRolesList: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/role?data=${encodeURIComponent(dataParam)}`
    );
  },
  addUser: (data, path = "") => httpRequest.post(`v2/items/${path}`, data),
  updateUser: (id, data) => httpRequest.put(`v2/items/users/${id}`, data),
  getUserById: (id) => httpRequest.get(`v2/items/users/${id}`, {}),
  deleteUser: (id, data) => httpRequest.delete(`v2/items/users/${id}`, {data}),
};

export default usersService;
