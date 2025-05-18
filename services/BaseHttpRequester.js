import { ACCESS_TOKEN_KEY } from '../constants/tokenConstant';
import { getToken } from '../storage/tokenStorage';
export class BaseHttpRequester {
  static BASE_URL = "http://localhost:8199/api/v1/";
  static getUserToken() {
    return getToken(ACCESS_TOKEN_KEY)
  }
  static getHeaders() {
    const token = this.getUserToken();
    const obj = {
      headers: {
        "Content-Type": "application/json", // Adjust content type as needed
      },
    };
    if (token) {
      obj.headers.Authorization = `Bearer ${token}`;
    }
    return obj
  }
}
