import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import errorHandler from '../middleware/errorHandler.js';
import { status } from 'express/lib/response';

const generateToken = (userId, name, role) => {
    return jwt.sign({ userId, name, role },
        process.env.JWT_SECRET,
        { expiresIn: '1h', }
    )
}

const generatePassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

const checkUserExists = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

async function register(req, res, next) {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await checkUserExists(email);
        if (!userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        let role = 'customer';
        const hashPassword = await generatePassword(password);
        const newUser = new User({
            name,
            email,
            hashPassword,
            phone,
            role
        });
        await newUser.save();
        res.status(201).json({ name, email, phone });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const userExists = await checkUserExists(email);
        if (!userExists) {
            return status(400).json({ message: 'User does not exist. You must sign in' });
        }
        const isMatch = await bcrypt.compare(password, userExists.hashPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const Token = generateToken(userExists._id, userExists.name, userExists.role);
        res.status(200).json({ token });
    }
    catch (error) {
        next(error);
    }
}

export {register, login};

