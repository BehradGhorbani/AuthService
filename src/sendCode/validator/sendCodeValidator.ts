import {EMAIL_REGEX} from "../constant/sendCodeConstant";
import {General_Errors} from "../../utils/utils";

export function emailValidator(email: string) {
    if (!email || typeof (email) !== "string" || !EMAIL_REGEX.test(email)){
        throw {reason: General_Errors.EMAIL_NOT_VALID};
    } else {
        return email
    }
}