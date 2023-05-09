import {dbConnect} from "./dbConfig";
const dotenv = require("dotenv");
dotenv.config();
const fastify = require('fastify');
const app = fastify();

import cors from '@fastify/cors'
const port = process.env['PORT'];
const dbUrl = process.env['DATABASE_URL'];

const sendCode = require('./src/sendCode/port/sendCode').sendCode;
const loginRoute = require('./src/user/port/login').login;

async function startServer() {
    await app.listen({port, host: '0.0.0.0'}, (err: any) => {
        if (err) {
            console.log('error happened: ' + err)
            process.exit(1);
        } else {
            console.log(`========( Server is up at port ${app.server.address().port})========`);
        }
    })
}

async function main() {
    await app.register(cors);
    app.register(sendCode, {prefix: "/sendCode"});
    app.register(loginRoute, {prefix: "/user"});

    await dbConnect(dbUrl);
    await startServer()
}


main()