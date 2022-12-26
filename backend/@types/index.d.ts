import { HostClient } from 'atlassian-connect-express';

declare global {
  namespace Express {
    export interface Request {
      context: HostClient;
    }
  }
}
export type MacroParameters = {
  pageId: { value: string };
  macroId: { value: string };
};
