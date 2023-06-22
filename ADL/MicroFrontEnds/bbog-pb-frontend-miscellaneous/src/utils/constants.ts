import axios from 'axios';

export const axiosADLInstance = axios.create({ baseURL: process.env.API_URL });

export const SEARCH_OFFICE_URL = 'https://www.bancodebogota.com/BuscadordePuntosBogota/?entidad=bogota';
