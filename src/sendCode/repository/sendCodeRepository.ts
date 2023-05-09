import * as mongoose from "mongoose";
import {sendCodeSchema} from "../schemas/sendCodeSchema";
import {Document, Model} from "mongoose";
import {SendCode} from "../entity/sendCode";
import {CreateCodeParams, EMAIL_RATE_LIMIT_MINUTE} from "../constant/sendCodeConstant";
import {TimeToMS} from "../../utils/utils";
import {UserLoginParams} from "../../user/constant/userConstant";

interface MongoSendCode {
    email: string;
    code: string;
    expirationDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface ISendCodeModel extends MongoSendCode, Document {}

function mongooseSendCodeAdopter(mongoSendCode: ISendCodeModel): SendCode {
    return new SendCode(
        mongoSendCode._id,
        mongoSendCode.email,
        mongoSendCode.code,
        mongoSendCode.expirationDate,
        mongoSendCode.createdAt,
        mongoSendCode.updatedAt
    )
}

export class SendCodeRepository {
    private model!: Model<ISendCodeModel>;
    constructor() {
        this.model = mongoose.model<ISendCodeModel>("code", sendCodeSchema);
    }
    async createCode(createCodeParams: CreateCodeParams): Promise<SendCode> {
        const code = await this.model.create(createCodeParams);
        return mongooseSendCodeAdopter(code);
    }

    async expireCodes(email: string): Promise<void> {
        await this.model.updateMany({email}, {expirationDate: 0});
    }

    async getActiveCode(userLoginParams: UserLoginParams): Promise<SendCode | null> {
        const sendCode = await this.model.findOne({email: userLoginParams.email, code: userLoginParams.code, expirationDate: {$gt: new Date()}});

        if(!sendCode) return null;

        return mongooseSendCodeAdopter(sendCode);
    }

    async checkActiveCodeByLimit(email: string): Promise<SendCode | null> {
        const sendCode =  await this.model.findOne({email, createdAt: {$gte: new Date().getTime() - TimeToMS.minute * EMAIL_RATE_LIMIT_MINUTE}});
        if (!sendCode) return null
        return mongooseSendCodeAdopter(sendCode);
    }
}