import express from "express";
import { allUsers, authUser, registerUser } from "../controlleres/UserControler.js";
// import authMiddleWare from "../AuthMiddleWare/authmiddleware.js";
import User from "../models/UserModel.js";


const userRoutes = express.Router()


userRoutes.post('/register', registerUser)
userRoutes.post('/login', authUser)
userRoutes.get('/users', allUsers)

// for notifications =====================
// userRoutes.post('/saveExpoPushToken', async (req, res) => {
//     const { userId, expoPushToken } = req.body;

//     if (!userId || !expoPushToken) {
//         return res.status(400).json({ message: 'User ID and Expo Push Token are required.' });
//     }

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         user.expoPushToken = expoPushToken; // Save token
//         await user.save();
//         res.status(200).json({ message: 'Expo Push Token saved successfully.' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error saving token.', error });
//     }
// });
export default userRoutes