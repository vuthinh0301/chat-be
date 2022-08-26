// COMMON
export const DATA_REFERENCE = 'DATA_REFERENCE';

// USER
export const BLACKLIST_TOKEN = 'BLACKLIST_TOKEN';
export const USER_NOT_EXIST = 'USER_NOT_EXIST';
export const WRONG_USER_OR_PASSWORD = 'WRONG_USER_OR_PASSWORD';
export const INACTIVE = 'INACTIVE';
export const BLOCKED = 'BLOCKED';
export const DELETED = 'DELETED';
export const WRONG_CURRENT_PASSWORD = 'WRONG_CURRENT_PASSWORD';
export const USER_ALREADY_ACTIVE = 'USER_ALREADY_ACTIVE';
export const USER_ALREADY_BLOCKED = 'USER_ALREADY_BLOCKED';

// ACTIVE CODE
export const USER_ACTIVE_CODE_EXPIRED = 'USER_ACTIVE_CODE_EXPIRED';

//FORGOT CODE
export const FORGOT_CODE_EXPIRED = 'FORGOT_CODE_EXPIRED';
export const FORGOT_CODE_NOT_EXIST = 'FORGOT_CODE_NOT_EXIST';

// PERMISSION

export const PERMISSION_NOT_EXIST = 'PERMISSION_NOT_EXIST';

// ROLE

export const ROLE_NOT_EXIST = 'ROLE_NOT_EXIST';

// FIGURE

export const FIGURE_NOT_EXIST = 'FIGURE_NOT_EXIST';

// BACKGROUND

export const BACKGROUND_NOT_EXIST = 'BACKGROUND_NOT_EXIST';

// LESSON

export const LESSON_NOT_EXIST = 'LESSON_NOT_EXIST';

// CONVERSATION

export const CONVERSATION_NOT_EXIST = 'CONVERSATION_NOT_EXIST';

// VERSION
export const VERSION_NOT_EXIST = 'VERSION_NOT_EXIST';

export const ERROR_CODES = new Map<string, string>([
  [DATA_REFERENCE, 'Data reference'],

  [BLACKLIST_TOKEN, 'Token is in blacklist (logout, deleted, ...)'],

  [USER_NOT_EXIST, 'User is not exist'],
  [WRONG_USER_OR_PASSWORD, 'User or password login are wrong.'],
  [INACTIVE, 'User account is not active.'],
  [BLOCKED, 'User account is blocked.'],
  [DELETED, 'User account is deleted.'],
  [WRONG_CURRENT_PASSWORD, 'Wrong current password'],
  [USER_ALREADY_ACTIVE, 'User already active'],
  [USER_ALREADY_BLOCKED, 'User already blocked'],

  [USER_ACTIVE_CODE_EXPIRED, 'Active code expired'],

  [PERMISSION_NOT_EXIST, 'Permission is not exist'],

  [ROLE_NOT_EXIST, 'Role is not exist'],

  [FIGURE_NOT_EXIST, 'Figure is not exist'],

  [BACKGROUND_NOT_EXIST, 'Background is not exist'],

  [LESSON_NOT_EXIST, 'Lesson is not exist'],

  [CONVERSATION_NOT_EXIST, 'Conversation is not exist'],

  [VERSION_NOT_EXIST, 'Version is not exist'],
]);
