// src/composables/useAuth.js
import { ref } from "vue";

const ACCESS_TOKEN_KEY_KEY = "ACCESS_TOKEN_KEY";
const USER_KEY = "logged_in_user";

const isWindowLoaded = computed(() => {
    if (window !== "undefined" && window !== null && window?.localStorage) {
      return true;
    }
    return false;
  });
const authToken = computed(() => {
  if (isWindowLoaded.value) {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY_KEY);
    return token ? token : null;
  }
  return "";
});

export function useAuth() {
  const isAuthenticated = computed(() => !!authToken.value);

  const authUser = computed(() => {
    if (isWindowLoaded.value) {
      const user = window.localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  });

  const hasAuthUserMembership = computed(() => {
    const user = authUser.value;
    if (user && user.has_membership) {
      return user.has_membership;
    }
    return false;
  });

  return {
    isAuthenticated,
    authUser,
    hasAuthUserMembership
  };
}
