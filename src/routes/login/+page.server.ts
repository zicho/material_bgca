/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies, request }: any) => {
      const data = await request.formData();
      const username = data.get('username');
      const password = data.get('password');

      console.log(username, password)
   
      return { success: true };
    }
  };