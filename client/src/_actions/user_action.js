import axios from "axios";
import {
  LOGIN_USER, REGISTER_USER, AUTH_USER
} from "./types";

export function loginUser(dataToSubmit) {
  const request = axios.post('http://localhost:5000/api/users/login', dataToSubmit)
                        .then(response => { return response.data; });
  return {
    type: LOGIN_USER,
    payload: request
  }
};

export function registerUser(dataToSubmit) {
  const request = axios.post('http://localhost:5000/api/users/register', dataToSubmit)
                        .then(response => { return response.data; });
  return {
    type: REGISTER_USER,
    payload: request
  }
};

export function auth() {
  const request = axios.get('http://localhost:5000/api/users/auth')
                        .then(response => { 
                          console.log(response.data);
                          return response.data; 
                        });
  return {
    type: AUTH_USER,
    payload: request
  }
};