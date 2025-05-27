import { HttpRequester } from "./HttpRequester";

export class UserService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`user${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async getTree(query='') {
    try {
      return await HttpRequester.get(`family-tree${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async findRelationship(query='') {
    try {
      return await HttpRequester.get(`find-relationship${query}`);
    } catch (err) {
      throw err;
    }
  }
  static async create(data) {
    try {
      return await HttpRequester.post('user', data);
    } catch (err) {
      throw err;
    }
  }
  static async register(data) {
    try {
      return await HttpRequester.post('register', data);
    } catch (err) {
      throw err;
    }
  }
  static async resetPassword(data) {
    try {
      return await HttpRequester.post('reset-password', data);
    } catch (err) {
      throw err;
    }
  }
  static async forgetPassword(data) {
    try {
      return await HttpRequester.post('forgot-password', data);
    } catch (err) {
      throw err;
    }
  }
  static async login(data, query='') {
    try {
      let url = 'login';
      if (query) {
        url = url + query;
      }
      return await HttpRequester.post(url, data);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('user/' + id);
    } catch (err) {
      throw err;
    }
  }
}
