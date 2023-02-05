import {Router} from 'express'
import validateSchema from '../middlewares/schemaValidator';
import { checkOrder } from '../controller/UserController';
import { checkOrder as checkOrderSchema } from '../api_schemas/user';

const router = Router();

router.post('/check_order', validateSchema(checkOrderSchema), checkOrder)

export default router