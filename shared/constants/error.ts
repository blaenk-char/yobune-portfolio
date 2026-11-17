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
    mismatch: 'Passwords do not match',
    regex: {
      lowercase: 'Password must contain lowercase letters',
      number: 'Password must contain numbers',
      spaces: 'Password must not contain spaces',
      special: 'Password must contain special characters',
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
  commission: {
    titleRequired: 'Title is required',
    titleMax: 'Title must be at most 128 characters',
    descriptionRequired: 'Description is required',
    priceMin: 'Price cannot be negative',
    slotsMin: 'Slots total must be at least 0',
    labelRequired: 'Field label is required',
    labelMax: 'Label must be at most 255 characters',
    placeholderMax: 'Placeholder must be at most 255 characters',
    optionsRequired: 'Checkbox and radio fields must have at least one option',
    multiplierMin: 'Multiplier must be greater than 0',
    fieldRequired: 'This field is required',
    notFound: 'Commission service not found',
    orderNotFound: 'Commission order not found',
    noSlotsAvailable: 'No commission slots available for this service',
    invalidStatusTransition: 'Cannot cancel a commission that is already in progress or completed'
  },
  shop: {
    titleRequired: 'Product title is required',
    titleMax: 'Product title must be at most 128 characters',
    descriptionRequired: 'Product description is required',
    priceMin: 'Price cannot be negative',
    fileRequired: 'Downloadable file path is required',
    notFound: 'Shop product not found',
    notClaimed: 'You must claim or purchase this item before downloading'
  },
  storage: {
    uploadFailed: 'Failed to upload file',
    downloadFailed: 'Failed to generate download link',
    deleteFailed: 'Failed to delete file'
  },
  rateLimit: 'Too many requests, please try again later',
  server: 'Something went wrong'
}
