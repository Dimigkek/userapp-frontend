import axios from "./axios";

const BASE_URL = "/tasks";

const taskApi = {
    getTasksByOwner: (ownerId, page = 0, size = 5) =>
        axios.get(`${BASE_URL}/owner/${ownerId}?page=${page}&size=${size}`),

    getTasksByAssignee: (userId, page = 0, size = 5) =>
        axios.get(`${BASE_URL}/assignee/${userId}?page=${page}&size=${size}`),

    createTask: (taskData) =>
        axios.post(BASE_URL, taskData),

    assignUser: (taskId, userId) =>
        axios.post(`${BASE_URL}/${taskId}/assign/${userId}`),

    deleteTask: (id) =>
        axios.delete(`${BASE_URL}/${id}`),

    getAllTasks: (page = 0, size = 5) => {
        return axios.get(`${BASE_URL}?page=${page}&size=${size}`);
    },

    getTaskById: (id) =>
        axios.get(`${BASE_URL}/${id}`),

    updateTaskStatus: (id, status) => {
        return axios.patch(`${BASE_URL}/${id}/status?status=${status}`);
    },

    updateTask: (id, taskData) => {
        return axios.put(`${BASE_URL}/${id}`, taskData);
    }
};

export default taskApi;