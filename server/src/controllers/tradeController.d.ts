import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const createTrade: (req: AuthRequest, res: Response) => Promise<void>;
export declare const closeTrade: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTrades: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTradeStats: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=tradeController.d.ts.map