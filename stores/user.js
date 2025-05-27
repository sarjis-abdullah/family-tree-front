import { defineStore } from "pinia";
import { UserService } from "~/services/UserService";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    selectedUser: null,
  }),
  getters: {
    userList(state) {
      return state.users;
    },
  },
  actions: {
    async fetchList() {
      try {
        const response = await UserService.getAll("");
        this.users = response.data || [];
      } catch (error) {
        throw error
      }
    },
    setselectedUser(id) {
      this.selectedUser = id;
    },
  },
});
