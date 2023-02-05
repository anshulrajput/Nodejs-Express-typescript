import {Router} from 'express';
import createResponse from '../utils/response.utils';
import vendorApi from './vendor.api'
import userApi from './user.api'

const router = Router()

router.get('/status', (req, res) => {
    res.status(200).json(createResponse(true,"API Success"));
});

router.use('/vendor', vendorApi)
router.use('/user', userApi);

export { router as ApiRoutes }
