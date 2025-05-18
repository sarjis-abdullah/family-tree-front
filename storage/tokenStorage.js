import { ACCESS_TOKEN_KEY, LOGIN_ACCOUNT, LOGGED_IN_USER_KEY } from '../constants/tokenConstant';

export function saveToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function saveUser(data) {
    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(data));
}

export function getUser() {
    const data = localStorage.getItem(LOGGED_IN_USER_KEY);
    return data ? JSON.parse(data) : null;
}

export function clearAuthData() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(LOGGED_IN_USER_KEY);
}
