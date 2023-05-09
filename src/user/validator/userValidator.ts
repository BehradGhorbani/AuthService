import {UserLoginParams} from "../constant/userConstant";
import {General_Errors} from "../../utils/utils";

export function validateUserLoginInput(userLoginParams: UserLoginParams): UserLoginParams {
  const {email, code} = userLoginParams;
  if (!email || typeof email !== "string" ||
      !code || typeof code !== "string") {

    throw {err: General_Errors.REQUEST_BODY_IS_NOT_VALID};
  } else {
    return userLoginParams;
  }
}