import mongoose from 'mongoose';
import {app} from './app';

const start = async () => {
    if(!process.env.JWT_KEY)
        throw new Error("JWT_KET must be defined");
        
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to MongoDB");
    } catch (e){
        console.log(e);
    }

    app.listen(3000, () => {
        console.log("Auth service is Listening on 3000!!!");
    });
};

start();