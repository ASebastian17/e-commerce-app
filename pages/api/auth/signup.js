import bcrypt from 'bcryptjs';

import User from '../../../models/User';
import db from '../../../utils/db';

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return;
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password || !email.includes('@') || password.trim().length < 5) {
        res.status(400).json({ message: 'Validation error' });

        return;
    }

    await db.connect();

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        res.status(400).json({ message: 'User exists already' });
        await db.disconnect();

        return;
    }

    const newUser = new User({ name, email, password: bcrypt.hashSync(password), isAdmin: false });

    const user = newUser.save();

    await db.disconnect();

    res.status(201).send({
        message: 'Created user',
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
};

export default handler;
