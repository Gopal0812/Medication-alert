import mongoose from "mongoose";

export const dbConect = async ()=> {

    await mongoose.connect("mongodb+srv://tyrion:Gopal1234@cluster0.wviygad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log('connected to db');
    })
    .catch((error) => {
        console.log('connection failed', error); // Log the error
    });
}
