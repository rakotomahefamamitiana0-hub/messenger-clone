type ValidationErrors = {
  username?: string;
  email?: string;
  password?: string;
};

export const validateLogin = (data: { email?: string; password?: string }) => {
  const errors: ValidationErrors = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

export const validateRegister = (data: { username?: string; email?: string; password?: string }) => {
  const errors: ValidationErrors = {};

  if (!data.username) {
    errors.username = 'Username is required';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

export default { validateLogin, validateRegister };