import * as mongoose from "mongoose";
import {userSchema} from "../schemas/userSchema";
import {User} from "../entity/user";
import {Document, Model} from "mongoose";

interface MongoUser {
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserModel extends MongoUser, Document {}

function mongooseUserAdopter(mongoUser: IUserModel): User {
    return new User(
        mongoUser._id,
        mongoUser.email,
        mongoUser.createdAt,
        mongoUser.updatedAt
    )
}
export class UserRepository {
    private model!: Model<IUserModel>;
    constructor() {
        this.model = mongoose.model<IUserModel>("user", userSchema);
    }
    async createUser(email: string): Promise<User> {
        const user = await this.model.create({email});
        return mongooseUserAdopter(user);
    }

    async getUserByUserId(userId: string): Promise<User | null> {
        const user = await this.model.findOne({_id: userId});

        if(!user) return null;

        return mongooseUserAdopter(user);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.model.findOne({email});

        if(!user) return null;

        return mongooseUserAdopter(user);
    }
}