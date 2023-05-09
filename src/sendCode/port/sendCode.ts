import {FastifyInstance} from "fastify/types/instance";
import {SendCodeInteractor} from "../interactor/sendCodeInteractor";
import {FastifyReply} from "fastify/types/reply";
import {FastifyRequest} from "fastify/types/request";

export async function sendCode(app: FastifyInstance) {
    // @ts-ignore
    app.post('/', async (req: FastifyRequest<{Body: {email: string}}>, rep: FastifyReply) => {
        const sendCodeInteractor = new SendCodeInteractor(rep);
        await sendCodeInteractor.sendEmailVerification(req.body.email)
    })
}