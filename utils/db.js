import mongoose from 'mongoose';

const connection = {};

const connect = async () => {
    if (connection.isConnected) {
        return;
    }

    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;

        if (connection.isConnected === 1) {
            return;
        }

        await mongoose.disconnect();
    }

    const db = await mongoose.connect(process.env.MONGO_URI);
    connection.isConnected = db.connections[0].readyState;
};

const disconnect = async () => {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = false;
        }
    }
};

const convertToObj = (doc) => {
    doc._id = doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc.updatedAt.toString();

    return doc;
};

const db = { connect, disconnect, convertToObj };

export default db;
