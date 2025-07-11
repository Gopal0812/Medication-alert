import jwt from 'jsonwebtoken'
// import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcryptjs";
import User from '../models/UserModel.js';

const jwtToken = (id) => {
    return jwt.sign({ id }, "fuckofff", { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {

    const { username, email, password, fcmToken } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please Enter All Fields" })
        }
        // check if user  is there or not 
        const userExits = await User.findOne({ email })
        if (userExits) {
            return res.status(400).json({ message: 'user alredy exists' })
        }


        //validate password lenght
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            fcmToken
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: jwtToken(user._id),
                fcmToken,
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User email does not exist.' });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const token = jwtToken(user._id);

        return res.status(200).json({
            message: 'Login successful',
            token,
            _id: user._id,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};
// get users based on search 
export const allUsers = async (req, res) => {
    try {
        // Build search query
        const keyword = req.query.search ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};

        // Validate that req.user exists
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Find users excluding the logged-in user
        const users = await User.find(keyword)
            .find({ _id: { $ne: req.user._id } })
            .select('username email')


        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.error('allUsers Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};