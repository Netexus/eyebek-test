import { Schema, model, Model } from "mongoose";
import { unique } from "next/dist/build/utils";


const usersSchema = new Schema({
 image: {
        type: String
    }
},{versionKey:false});

// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let UsersModel: Model<any>;



try {
    
    UsersModel = model("users");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
    
    UsersModel = model("users", usersSchema);
}



export default UsersModel;