import {Router} from 'express'
import validateSchema from '../middlewares/schemaValidator';
import { updateMultipleStockAndPrice, updateStockAndPrice } from '../controller/VendorController';
import { updateMultipleStockAndPrice as updateMultipleStockAndPriceSchema, updateStockAndPrice as updateStockAndPriceSchema } from '../api_schemas/vendor';

const router = Router();

router.patch('/update_single_apparel', validateSchema(updateStockAndPriceSchema), updateStockAndPrice)
router.patch('/update_multiple_apparels', validateSchema(updateMultipleStockAndPriceSchema), updateMultipleStockAndPrice)

export default router