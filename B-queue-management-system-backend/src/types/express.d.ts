// filepath: src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // Add the 'user' property to the Request object
    }
  }
}