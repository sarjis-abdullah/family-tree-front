export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
      const token = localStorage.getItem('ACCESS_TOKEN_KEY')
  
      // Redirect unauthenticated users trying to access protected routes
      if (!token && to.path !== '/login') {
        return navigateTo('/login')
      }
  
      // Redirect authenticated users away from login/register
      if (token && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/dashboard')
      }
    }
  })
  