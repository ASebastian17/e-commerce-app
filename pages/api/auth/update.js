import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';

import db from '../../../utils/db';
import User from '../../../models/User';

const handler = async (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(400).send({ message: `${req.method} not supported` });
    }

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).send({ message: 'Signin required' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password || !email.includes('@') || password.trim().length < 5) {
        res.status(400).json({ message: 'Validation error' });

        return;
    }

    await db.connect();

    const updatedUser = await User.findById(session.user_id);
    updatedUser.name = name;
    updatedUser.email = email;

    if (password) {
        updatedUser.password = bcryptjs.hashSync(password);
    }

    await updatedUser.save();

    await db.disconnect();

    res.send({ message: 'User updated' });
};

export default handler;
