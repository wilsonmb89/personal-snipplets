import axios from 'axios';

export const axiosADLInstance = axios.create({ baseURL: process.env.API_URL });
