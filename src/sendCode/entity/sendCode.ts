export class SendCode {
    constructor(
        public objectId: string,
        public email: string,
        public code: string,
        public expirationDate: Date,
        public createdAt: Date,
        public updatedAt: Date,
    ) {
    }
}