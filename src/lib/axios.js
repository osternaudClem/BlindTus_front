import axios from 'axios';
import { api } from '../config';
const API = api[process.env.NODE_ENV];

/**
 * @name callApi
 */
export const callApi = axios.create({
  baseURL: `${API}/api`,
  timeout: 30000,
  headers: { Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}` },
});
