export const ERROR_MESSAGE = {
  auth: {
    invalid: 'Invalid or expired token',
    token: 'Missing auth token',
    user: 'User not found'
  },
  email: 'Email is not valid',
  password: {
    min: 'Password must be at least 8 characters',
    max: 'Password must be less than 128 characters',
    regex: {
      lowercase: 'Password must container lowercase letters',
      number: 'Password must contain numbers',
      spaces: 'Password must not contain spaces',
      special: 'Password must special characters',
      uppercase: 'Password must contain uppercase letters'
    },
    string: 'Password is required'
  },
  user: {
    id: 'Missing user id',
    notFound: 'Profile not found',
    permission: 'Insufficient permissions',
    session: 'No active session'
  },
  username: {
    max: 'Username must be less than 50 characters',
    min: 'Username must be at least 3 characters',
    regex: 'Username can only contain letters, numbers, _ and -',
    string: 'Username is required',
    unique: 'Username already taken'
  },
  required: {
    email: 'Email is required',
    password: 'Password is required'
  },
  server: 'Something went wrong'
}
