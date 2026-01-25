import { env } from '~/config/environment'

// Những cái domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_DOMAINS = [
  'http://localhost:5173'
  // vv ví dụ sau này sẽ deploy lên domain chính thức..
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT