import {Publisher, Subjects, TicketCreatedEvent} from '@hanytickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
};