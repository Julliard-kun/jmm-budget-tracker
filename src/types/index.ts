import 'express-session';

declare module 'express-session' {
  interface SessionData {
    username?: string;
    first_name?: string;
    last_name?: string;
  }
} 