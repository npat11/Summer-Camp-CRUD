const { MongoClient, ObjectId,ServerApiVersion } = require('mongodb');
require("dotenv").config();

class ApplicationDB {
    #client
    #dbName
    #collection

    constructor() {
        this.#dbName = process.env.MONGO_DB_NAME;
        this.#collection = process.env.MONGO_COLLECTION;
    }
    
    async connect() {
        let userName = process.env.MONGO_DB_USERNAME;
        let password = process.env.MONGO_DB_PASSWORD;
        
        const uri = `mongodb+srv://${userName}:${password}@project4.ngo4oev.mongodb.net/?retryWrites=true&w=majority&appName=Project4`;
        this.#client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        
        await this.#client.connect();
    }

    async listDatabases() {
        await this.connect();
        const dbsList = await this.#client.db().admin().listDatabases();
    
        console.log("Databases: ");
        dbsList.databases.forEach(db => {
            console.log(`DB Name: ${db.name}`);
        });
        console.log("Collection:");
        console.log(`${this.#collection}`);
    }

    async listApplications() {
        try {
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            const applications = await collection.find({}).toArray();
            return applications;
        } finally {
            await this.#client.close();
        }
    }    

    async insertApplication(application) {
        try {
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            const result = await collection.insertOne(application);
            console.log(`Application inserted with _id: ${result.insertedId}`);
        } finally {
            await this.#client.close();
        }
    }

    async lookUpApplication(email) {
        try {
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            const query = { email: email };
            const result = await collection.findOne(query);
            return result;
        } finally {
            await this.#client.close();
        }
    }        

    async lookUpGPA(gpa) {
        try {
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            const query = { gpa: { $gte: gpa } };
            const result = await collection.find(query).toArray();
            return result;
        } finally {
            await this.#client.close();
        }
    }

    async getApplicationById(id) {
        try {
            console.log("here")
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            const query = { _id: new ObjectId(id) };
            console.log(query);
            const result = await collection.findOne(query);
            return result;
        } catch (err) {
            console.error(err);
            throw err; 
        } finally {
            await this.#client.close();
        }
    }

    async updateApplication(id, updatedApplication) {
        try {
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            delete updatedApplication._id;
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedApplication }
            );
            return result;
        } finally {
            await this.#client.close();
        }
    }

    async deleteApplication(id) {
        try {
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            const objectId = new ObjectId(id);
            const result = await collection.deleteOne({ _id: objectId });
            return result;
        } finally {
            await this.#client.close();
        }
    }

    async deleteAllApplications() {
        try {
            await this.connect();
            const database = this.#client.db(this.#dbName);
            const collection = database.collection(this.#collection);
            const result = await collection.deleteMany({});
            console.log(`${result.deletedCount} applications deleted`);
            return result.deletedCount;
        } finally {
            await this.#client.close();
        }
    }    
}

module.exports = { ApplicationDB }

//checking to make sure the correct thing uploaded