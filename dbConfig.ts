import * as mongoose from "mongoose";

export async function dbConnect(url?: string) {
    if (url) {
        try {
            await mongoose.connect(url);
            console.log(`========( DB Connection Was SuccessFul )========`);
        } catch (e) {
            console.log(`!!! Db Connection Has been Failed !!!`);
            process.exit(1)
        }
    } else {
        console.log(`!!! Db Url Not Defined !!!`);
        process.exit(1)
    }
}