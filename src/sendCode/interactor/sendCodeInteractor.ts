import {FastifyReply} from "fastify/types/reply";
import {General_Errors, getRandomCharacters, Output, TimeToMS} from "../../utils/utils";
import {emailValidator} from "../validator/sendCodeValidator";
import {SendCodeRepository} from "../repository/sendCodeRepository";
import {
    CreateCodeParams,
    EMAIL_EXPIRATION_MINUTE,
    EMAIL_RATE_LIMIT_MINUTE,
    TOKEN_LENGTH
} from "../constant/sendCodeConstant";

export class SendCodeInteractor {
    readonly output;
    readonly sendCodeRepository;

    constructor(rep: FastifyReply) {
        this.output = new Output(rep);
        this.sendCodeRepository = new SendCodeRepository();
    }

    async sendEmailVerification(email: string): Promise<void> {
        try {
            const hasActiveCode = await this.sendCodeRepository.checkActiveCodeByLimit(email);

            if (hasActiveCode) {
                return this.output.error(General_Errors.FORBIDDEN, 403);
            }

            email = emailValidator(email);
            const code = getRandomCharacters(TOKEN_LENGTH, true);
            const createSendCodeParam: CreateCodeParams = {
                email,
                code,
                expirationDate: new Date(new Date().getTime() + TimeToMS.minute * EMAIL_EXPIRATION_MINUTE),
            }
            await this.sendCodeRepository.expireCodes(email);

            await this.sendCodeRepository.createCode(createSendCodeParam);
            await this.emailSender(`${code}`, 'Rico Chat Login Code', email);

            return this.output.result({timer: EMAIL_RATE_LIMIT_MINUTE * 60}, 200)
        } catch (e) {
            return this.output.error(e, 500)
        }
    }

    async emailSender(text: string, subject: string, to: string): Promise<void> {
        const nodemailer = require("nodemailer");
        const email = process.env['EMAIL_USER'];
        const password = process.env['EMAIL_PASS'];
        let transporter = nodemailer.createTransport({
            service: "Outlook",
            secure: false,
            auth: {
                user: email,
                pass: password
            }
        });

        const mailOptions = {
            from: email,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
    }
}