import axios from "./axios";

// Αν το axios.js έχει ήδη το /api, εδώ βάλε μόνο /tasks
const BASE_URL = "/tasks";

const taskApi = {
    getTasksByOwner: (ownerId, page = 0) =>
        axios.get(`${BASE_URL}/owner/${ownerId}?page=${page}`),

    getTasksByAssignee: (userId, page = 0) =>
        axios.get(`${BASE_URL}/assignee/${userId}?page=${page}`),

    createTask: (taskData) =>
        axios.post(BASE_URL, taskData), // Αυτό θα χτυπήσει στο /api/tasks

    assignUser: (taskId, userId) =>
        axios.post(`${BASE_URL}/${taskId}/assign/${userId}`),

    deleteTask: (id) =>
        axios.delete(`${BASE_URL}/${id}`)
};

export default taskApi;