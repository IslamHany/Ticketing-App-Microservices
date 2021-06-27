import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import {TicketCreatedListener} from './events/listeners/ticket-created-listener';
import {TicketUpdatedListener} from './events/listeners/ticket-updated-listener';

const start = async () => {
    if (!process.env.JWT_KEY)
        throw new Error("JWT_KET must be defined");

    if (!process.env.MONGO_URI)
        throw new Error("MONGO_URI must be defined");

    if (!process.env.NATS_CLIENT_ID)
        throw new Error("NATS_CLIENT_ID must be defined");

    if (!process.env.NATS_URL)
        throw new Error("NATS_URL must be defined");

    if (!process.env.NATS_CLUSTER_ID)
        throw new Error("NATS_CLUSTER_ID must be defined");

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        const client = natsWrapper.client;
        client.on('close', () => {
            console.log("NATS connection closed!");
            process.exit();
        });
        process.on('SIGINT', () => client.close());
        process.on('SIGTERM', () => client.close());

        new TicketCreatedListener(client).listen();
        new TicketUpdatedListener(client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to MongoDB");
    } catch (e) {
        console.log(e);
    }

    app.listen(3000, () => {
        console.log("Orders service is Listening on 3000!!!");
    });
};

start();