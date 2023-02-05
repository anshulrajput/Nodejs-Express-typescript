import express from 'express'
import cors from 'cors'
import {ApiRoutes} from './routes/api';
import unkownRouteHandler from './middlewares/unkownRouteHandler';
import errorHandler from './middlewares/errorHandler';

const createServer = () => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(express.json()) ;

    // Disable x-powered-by header
    app.disable('x-powered-by');

    // all defined api routes
    app.use('/api', ApiRoutes);

    // 404 for unknown routes
    app.use('*', unkownRouteHandler);
    
    //error middleware to send appropriate response
    app.use(errorHandler);

    app.listen(8181, () => {
        console.log(`Server listening on: 8181`);
    });
};

export { createServer };