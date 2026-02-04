import api from "./axios";

export const getUsers = () => api.get("/users");

export const getUserById = (id) => api.get(`/users/${id}`);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const createUser = (data) => api.post("/users", data);
