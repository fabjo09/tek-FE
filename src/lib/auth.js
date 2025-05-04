// Authentication service

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem("auth_token") !== null;
};

// Get the current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Get quiz answers
export const getQuizAnswers = () => {
  const answersStr = localStorage.getItem("quiz_answers");
  if (!answersStr) return null;
  return JSON.parse(answersStr);
};

// Log out
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  // We'll keep quiz answers in case the user wants to login again
};
