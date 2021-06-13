import {Publisher, OrderCreatedEvent, Subjects} from '@hanytickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
};