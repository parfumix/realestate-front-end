// plugins/init-user.js
export default defineNuxtPlugin(async () => {
    const { createAnonymousUser, user } = useAuthService()
  
    const token = useCookie('token')?.value; // JWT token stored in cookies

    if (!user.value) {
      await createAnonymousUser();
    }
  });
  