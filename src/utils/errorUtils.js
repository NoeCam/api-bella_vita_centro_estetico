/// authAdminController
export const invalidCredentialsError = () => {
  throw {
    httpStatus: 401,
    code: "INVALID_CREDENTIALS",
    message: "Invalid credentials",
  };
};

/// authAdminController
export const notAuthenticatedError = () => {
  throw {
    httpStatus: 401,
    code: "NOT_AUTHENTICATED",
    message: `You must send a token in the 'Authorization' header`,
  };
};
