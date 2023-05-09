export const EMAIL_RATE_LIMIT_MINUTE = 2
export const EMAIL_EXPIRATION_MINUTE = 15
export const TOKEN_LENGTH = 6

export const EMAIL_REGEX = /\S+@\S+\.\S+/;

export type CreateCodeParams = {
    email: string,
    code: string,
    expirationDate: Date
}