import axios from 'axios';

const API_URL = "http://localhost:8080/api/audit";

export const getAuditLogs = (page = 0, size = 10) => {
    return axios.get(`${API_URL}?page=${page}&size=${size}`);
};