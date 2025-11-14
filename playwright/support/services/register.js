export const registerService = (request) => {
  const newRegister = async (user) => {
    return await request.post("http://localhost:3333/api/auth/register", {
      data: user,
    });
  };
  return {
    newRegister,
  };
};
