import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const createSession: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSession: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSession: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllSessions: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=replayController.d.ts.map