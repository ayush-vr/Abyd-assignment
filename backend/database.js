const mongoose = require('mongoose');
require('dotenv').config();
const ContractModel = require('./models'); // Importing the model

const MONGO_URL = process.env.MONGO_URI;

class MockDB {
    async save(data) {
        console.log(`[MockDB] Saved document: ${JSON.stringify(data)}`);
        return data;
    }
}

let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URL, { dbName: 'contract_db' });
        isConnected = true;
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        isConnected = false;
    }
}

async function saveContractToDB(data) {

    //failsafe
    if (!isConnected) {
        console.log("Database not connected, using MockDB.");
        const mock = new MockDB();
        return await mock.save(data);
    }
    try {
        const newContract = new ContractModel(data);
        return await newContract.save();
    } catch (error) {
        console.error("Error saving to DB:", error);
        return null;
    }
}

module.exports = { connectDB, saveContractToDB };
