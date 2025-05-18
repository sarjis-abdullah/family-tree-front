// src/composables/useAuth.js
import { ref } from "vue";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "logged_in_user";

const token = computed(() => {
  //   const token = useStorage(ACCESS_TOKEN_KEY, null); // persists in localStorage
  //   return token ? token : null;
  //   const user = useStorage(USER_KEY, null);
  if (window !== "undefined" && window !== null && window?.localStorage) {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    return token ? token : null;
  }
  return "";
});
// const user = ref(JSON.parse(localStorage.getItem(USER_KEY)) || null);

export function useAuth() {
  const isAuthenticated = ref(!!token.value);


  //   const getUser = () => user.value;

  return {

    // getUser,
    isAuthenticated,
  };
}
