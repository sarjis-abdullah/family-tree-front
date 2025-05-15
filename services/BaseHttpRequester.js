export class BaseHttpRequester {
  static BASE_URL = "http://localhost:8199/api/v1/";
  static getToken() {
    return window.localStorage.getItem("ACCESS_TOKEN");
  }
  static getHeaders() {
    const token = this.getToken();
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
