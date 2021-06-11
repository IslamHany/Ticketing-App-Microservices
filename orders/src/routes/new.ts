import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import {OrderStatus, requireAuth, BadRequestError, validateRequest, NotFoundError} from '@hanytickets/common';
import {body} from 'express-validator';
import {Ticket} from '../models/ticket';
import {Order} from '../models/orders';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; //15 minutes

router.post('/api/orders', requireAuth, 
[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
]
, validateRequest, 
async (req: Request, res: Response) => {
    const {ticketId} = req.body;
    //Find the ticket the user is trying to order in the DB
    const ticket = await Ticket.findById(ticketId);

    if(!ticket)
        throw new NotFoundError();

    //Make sure that ticket is not already reserved
    //Run query to look at all orders. Find an order where the ticket
    //is the ticket we just found *and* the orders status is *not* cancelled.
    //If we find an order from that means the ticket *is* reserved
    const isReserved = await ticket.isReserved(); 

    if(isReserved)
        throw new BadRequestError('Ticket is already reserved');

    //Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //Build the order and save it to the DB
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    //Publish order:created event
    res.status(201);
    res.send(order);
});

export {router as newOrderRouter};