import { getSession } from 'next-auth/react';

import db from '../../../utils/db';
import Order from '../../../models/Order';

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).send('Signin required');
    }

    const { user_id } = session;

    await db.connect();

    const newOrder = new Order({
        ...req.body,
        user: user_id,
    });

    await db.disconnect();

    const order = await newOrder.save();

    res.status(201).send(order);
};

export default handler;
