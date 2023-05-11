import { getSession } from 'next-auth/react';

import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).send({ message: 'Signin required' });
    }

    await db.connect();
    const orders = await Order.find({ user: session.user_id });
    await db.disconnect();

    res.send(orders);
};

export default handler;
