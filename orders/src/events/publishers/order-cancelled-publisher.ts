import {Subjects, Publisher, OrderCancelledEvent} from '@hanytickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
};