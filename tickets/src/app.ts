import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {createTicketRouter} from './routes/new';
import {showTicketRouter} from "./routes/show";
import {indexTicketRouter} from './routes/index';
import {updateTicketRouter} from './routes/update';
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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

app.use(errorHandler); //error handling middleware

export {app};