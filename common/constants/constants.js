const MAX_FILE_SIZE = 512 // 500 KB

const Statuses = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
}

const Roles = {
  SUPER_ADMIN: '99-super-admin',
  ADMIN: '98-admin',
  MANAGER: '90-manager', //librarian
  AUTHOR: '10-author',
  USER: '01-user',
}

const Genders = {
  MALE: '01-male',
  FEMALE: '02-female',
  OTHER: '03-other',
}

const StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}

const regexEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
  Statuses,
  Roles,
  Genders,
  StatusCode,
  regexEmail,
  MAX_FILE_SIZE,
}
