import { Request, Response, NextFunction } from 'express'
import Joi from 'joi';
import createResponse from '../utils/response.utils';
import logger from '../utils/logging.utils'

const validateSchema = (schema: Joi.ObjectSchema) => {

    return async (req: Request,res: Response,next: NextFunction) => {

        var data;
        if(req.method.toLowerCase() == 'post' || 
        req.method.toLowerCase() == 'put' || 
        req.method.toLowerCase() == 'patch' ||
        req.method.toLowerCase() == 'delete')
            data = req.body
        else if(req.method.toLowerCase() == 'get')
            data = req.query

        if(data != undefined && schema != undefined){
            try{
                await schema.validateAsync(data)
                next()
            }
            catch(err: any){
                logger.error('Incorrect req - '+err.details[0].message.replace(/\"/g, ""))
                return res.status(410).json(createResponse(false,err.details[0].message.replace(/\"/g, "")));
            }
        }
        else{
            logger.error("Invalid Schema")
            return res.status(410).json(createResponse(false,"Invalid Schema"));
        }   
        
    }

}

export default validateSchema