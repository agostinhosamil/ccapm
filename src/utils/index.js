export const range = () => {};

export const setUserToken = (token) => {
  localStorage.setItem("user-auth-token", token);
};

export const getUserToken = () => {
  return localStorage.getItem("user-auth-token");
};
