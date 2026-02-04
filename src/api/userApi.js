import axios from "./axios";

const API_URL = "http://localhost:8080/api/users";

export const getUsers = (page = 0, size = 5) => {
    return axios.get(API_URL, {
        params: { page, size }
    });
};

export const getUserById = (id) => axios.get(`${API_URL}/${id}`);
export const createUser = (data) => axios.post(API_URL, data);
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response;
};

export default {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
};