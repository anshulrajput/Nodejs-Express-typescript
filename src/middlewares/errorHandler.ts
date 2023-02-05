import { Request, Response, NextFunction } from 'express'
import createResponse from '../utils/response.utils';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
    console.log(err)
    return res.status(500).json(createResponse(false,"Something went wrong"));
}

export default errorHandler