import { Request, Response, NextFunction } from 'express'
import createResponse from '../utils/response.utils';

const unkownRouteHandler = (req: Request, res: Response): Response => {
    return res.status(404).json(createResponse(false,"Not Found"));
}

export default unkownRouteHandler