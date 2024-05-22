// eslint-disable-next-line @typescript-eslint/no-unused-vars
import expressSession from 'express-session';
import { UserWithoutPassword } from 'src/modules/users/entity';

declare module 'express-session' {
  export interface SessionData {
    user?: UserWithoutPassword & { mailboxId?: string };
  }
}
