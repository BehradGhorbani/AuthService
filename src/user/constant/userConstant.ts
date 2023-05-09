import {User} from "../entity/user";

export type UserLoginParams = {
    email: string,
    code: string,
}

export type UserAuthOutputType = {
    user: User,
    accessToken: string
}
