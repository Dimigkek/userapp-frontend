import axios from "./axios";

export const getUsers = () => axios.get("/users");
export const getUserById = (id) => axios.get(`/users/${id}`);
export const createUser = (data) => axios.post("/users", data);
export const deleteUser = (id) => axios.delete(`/users/${id}`);

export default{
    getUsers,
    getUserById,
    createUser,
    deleteUser,
};
