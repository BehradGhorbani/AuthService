import {FastifyInstance} from "fastify/types/instance";
import {UserInteractor} from "../interactor/userInteractor";
import {FastifyReply} from "fastify/types/reply";
import {FastifyRequest} from "fastify/types/request";
import {General_Errors} from "../../utils/utils";
import {UserLoginParams} from "../constant/userConstant";

export async function login(app: FastifyInstance) {
    app.post('/login',async (req: FastifyRequest<{Body: UserLoginParams}>, rep: FastifyReply) => {
        try {
            const userInteractor = new UserInteractor(rep);
            await userInteractor.userLogin(req.body)
        } catch (e) {
            throw {msg: General_Errors.UNKNOWN}
        }
    })
}