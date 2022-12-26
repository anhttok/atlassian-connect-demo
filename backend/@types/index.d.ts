import {  HostClient } from 'atlassian-connect-express';
import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      context: HostClient;
    }
  }
}
