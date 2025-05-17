import { ACCESS_TOKEN, LOGIN_ACCOUNT, USER_DATA } from '../constants/tokenConstant';

export function saveToken(token) {
    localStorage.setItem(ACCESS_TOKEN, token);
}

export function getToken() {
    return localStorage.getItem(ACCESS_TOKEN);
}

export function removeToken() {
    localStorage.removeItem(ACCESS_TOKEN);
}

export function saveUser(data) {
    localStorage.setItem(USER_DATA, JSON.stringify(data));
}

export function getUser() {
    const data = localStorage.getItem(USER_DATA);
    return data ? JSON.parse(data) : null;
}

export function clearAuthData() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER_DATA);
    localStorage.removeItem(LOGIN_ACCOUNT);
}
