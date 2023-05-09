import {FastifyReply} from "fastify/types/reply";
import {UserRepository} from "../repository/userRepository";
import {General_Errors, Output} from "../../utils/utils";
import {SendCodeRepository} from "../../sendCode/repository/sendCodeRepository";
import {UserAuthOutputType, UserLoginParams} from "../constant/userConstant";
import {createJwtToken} from "../../authentication/authenticationWithJwt";
import {validateUserLoginInput} from "../validator/userValidator";

export class UserInteractor {
    readonly output;
    readonly userRepository;
    readonly sendCodeRepository;

    constructor(rep: FastifyReply) {
        this.output = new Output(rep);
        this.userRepository = new UserRepository();
        this.sendCodeRepository = new SendCodeRepository()
    }

    async userLogin(userLoginParams: UserLoginParams): Promise<void> {
        try {
            validateUserLoginInput(userLoginParams);

            const validCode = await this.sendCodeRepository.getActiveCode(userLoginParams);

            if(validCode) {
                let user = await this.userRepository.getUserByEmail(userLoginParams.email);

                if(!user){
                    user = await this.userRepository.createUser(userLoginParams.email);
                }

                const userWithToken: UserAuthOutputType = {
                    user,
                    accessToken: await createJwtToken(user)
                }

                await this.sendCodeRepository.expireCodes(userLoginParams.email);
                return this.output.result(userWithToken, 200);
            } else {
                return this.output.error(General_Errors.CODE_NOT_VALID, 404)
            }
        } catch (e) {
            await this.output.error(e, 403)
        }
    }
}