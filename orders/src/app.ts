import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {deleteOrderRouter} from './routes/delete';
import {indexOrderRouter} from './routes/index';
import {showOrderRouter} from './routes/show';
import {newOrderRouter} from './routes/new';
import { errorHandler, NotFoundError, currentUser } from '@hanytickets/common';

const app = express();
app.set('trust proxy', true); //trust ingress-nginx proxy
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' //true on prod environment . must be on https
    })
);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

app.use(errorHandler); //error handling middleware

export {app};