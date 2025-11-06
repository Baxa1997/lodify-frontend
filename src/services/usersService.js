import httpRequest from "../utils/httpRequest";

const usersService = {
  getList: (params = {}) => {
    const dataParam = JSON.stringify(params);
    return httpRequest.get(
      `v2/items/users?data=${encodeURIComponent(dataParam)}`,
    );
  },
  addUser: (data) => httpRequest.post("v2/items/users", data),
  updateUser: (id, data) => httpRequest.put(`v2/items/users/${id}`, data),
  getUserById: (id) => httpRequest.get(`v2/items/users/${id}`, {}),
  deleteUser: (id, data) => httpRequest.delete(`v2/items/users/${id}`, { data }),
};

export default usersService;
