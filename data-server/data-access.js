import { MongoClient } from 'mongodb';
// Declaring mongodb url connection.
const baseUrl = "mongodb://127.0.0.1:27017/";
// Declaring mongodb database name.
const dbName = 'custdb';
// Declaring mongodb database colection name.
const collectionName = 'customers';
let customers;

// Declaring dbStartup method - 
// Use this Method to start the mongodb connection.
async function dbStartup() {
    // Create a new client and connect to MongoDB
    const client = new MongoClient(baseUrl);
    await client.db(dbName);
    customers = client.db(dbName).collection(collectionName);
}

// Declaring getAllCustomers method - 
// Use this Method to get the customers list from mongodb.
async function getAllCustomers () {
    try {
        // Getting the customers list from custbd on MongoDb 
        const customer = await customers.find().toArray();
        return [customer, null];
        
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
};

// Declaring getCustomerByID method - 
// Use this Method to get the customer data filtered by ID from mongodb.
async function getCustomerByID (id) {
    try {
        // Getting the customer by ID from custbd on MongoDb 
        const customer = await customers.findOne({"id": +id});
        if(!customer){
          return [ null, "invalid customer number"];
        }
        return [customer, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
};



dbStartup();
// Exporting the methods
export  { getAllCustomers, getCustomerByID };