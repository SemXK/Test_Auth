import { AuthService } from './auth';
import { ApiService } from './api';

const url = 'http://localhost:4000';
export const authService = new AuthService(`${url}/auth`);
export const apiService = new ApiService(`${url}/app`, authService);
