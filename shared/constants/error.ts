export const ERROR_MESSAGE = {
  auth: {
    token: 'Missing auth token',
    invalid: 'Invalid or expired token',
    user: 'User not found'
  },
  email: 'Email is not valid',
  password: {
    string: 'Password is required',
    min: 'Password must be at least 8 characters',
    max: 'Password must be less than 128 characters',
    regex: {
      uppercase: 'Password must contain uppercase letters',
      lowercase: 'Password must container lowercase letters',
      number: 'Password must contain numbers',
      special: 'Password must special characters',
      spaces: 'Password must not contain spaces'
    }
  },
  user: {
    notFound: 'Profile not found',
    permission: 'Insufficient permissions',
    id: 'Missing user id',
    session: 'No active session'
  },
  username: {
    string: 'Username is required',
    min: 'Username must be at least 3 characters',
    max: 'Username must be less than 50 characters',
    regex: 'Username can only contain letters, numbers, _ and -',
    unique: 'Username already taken'
  },
  server: 'Something went wrong'
}
