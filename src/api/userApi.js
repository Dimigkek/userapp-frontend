import axios from "./axios";
const API_URL = "http://localhost:8080/api/users";
export const getUsers = (page = 0, size = 5) => {
    return axios.get(API_URL, {
        params: {
            page: page,
            size: size
        }
    });
};
export const getUserById = (id) => axios.get(`/users/${id}`);
export const createUser = (data) => axios.post("/users", data);
export const deleteUser = (id) => axios.delete(`/users/${id}`);

export default{
    getUsers,
    getUserById,
    createUser,
    deleteUser,
};
