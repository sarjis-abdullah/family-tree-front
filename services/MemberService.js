import { HttpRequester } from "./HttpRequester";

export class MemberService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`member${query}`);
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
      return await HttpRequester.post('member', data);
    } catch (err) {
      throw err;
    }
  }
  static async delete(id) {
    try {
      return await HttpRequester.delete('member/' + id);
    } catch (err) {
      throw err;
    }
  }
}
