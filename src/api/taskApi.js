import axios from "./axios";

const taskApi = {
    getTasksByOwner: (ownerId) => axios.get(`/tasks/owner/${ownerId}`),
    createTask: (payload) => axios.post("/tasks", payload),
    deleteTask: (id) => axios.delete(`/tasks/${id}`),
    assignUser: (taskId, userId) => axios.post(`/tasks/${taskId}/assign/${userId}`)
};

export default taskApi;