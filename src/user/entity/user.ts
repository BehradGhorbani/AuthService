export class User {
    constructor(
        public objectId: string,
        public email: string,
        public createdAt: Date,
        public updateAt: Date,
    ) {
    }

    toJson(): UserJson {
        return {
            objectId: this.objectId,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updateAt
        };
    }
}

export type UserJson = {
     objectId: string,
     email: string,
     createdAt: Date,
     updatedAt: Date,
};