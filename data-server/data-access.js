import { MongoClient } from 'mongodb';
// Declaring mongodb url connection.
const baseUrl = "mongodb://127.0.0.1:27017/";
// Declaring mongodb database name.
const dbName = 'custdb';
// Declaring mongodb database colection name.
const collectionName = 'customers';
let customersConecction;

// Declaring dbStartup method - 
// Use this Method to start the mongodb connection.
async function dbStartup() {
    // Create a new client and connect to MongoDB
    const client = new MongoClient(baseUrl);
    await client.db(dbName);
    customersConecction = client.db(dbName).collection(collectionName);
}

// Declaring getAllCustomers method - 
// Use this Method to get the customers list from mongodb database.
async function getAllCustomers() {
    try {
        // Getting the customers list from custbd on MongoDb 
        const customer = await customersConecction.find().toArray();
        return [customer, null];
        
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
};

// Declaring getCustomerByID method - 
// Use this Method to get the customer data filtered by ID from mongodb database.
async function getCustomerByID(id) {
    try {
        // Getting the customer by ID from custbd on MongoDb 
        const customers = await customersConecction.findOne({"id": +id});
        if(!customers){
          return [ null, "invalid customer number"];
        }
        return [customers, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
};

// Declaring getCustomerByID method - 
// Use this Method to get the customer data filtered by ID from mongodb database.
async function resetCustomers() {
    try {
        // Getting the customer by ID from custbd on MongoDb 
        let data = [
            { "id": 0, "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
            { "id": 1, "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
            { "id": 2, "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" },
            { "id": 3, "name": "Jhonattan Diaz", "email": "jhonnydiaz@abc.com", "password": "jedurr" },
            { "id": 4, "name": "Laura Gaviria", "email": "laugavi@abc.com", "password": "laurrw" }
        ];
        // Deleting the mongodb stored data.
        await customersConecction.deleteMany({});
        //Uploading the new data set
        await customersConecction.insertMany(data);
        const customersNew = await customersConecction.find().toArray();
        const message = "<p>data was refreshed. There are now " + 
                            customersNew.length + " customer records!</p></br>" + 
                            "<a href='/'>Go Back</a>"
        return [message, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
};

// Declaring addCustomer method - 
// Use this Method to add new the customers into the mongodb database.
async function addCustomer(newCustomerInfo) {
    try {
        // Creating the new record into the database
        const insertCustomerResult = await customersConecction.insertOne(newCustomerInfo);
        return ["success", insertCustomerResult.insertedId, null];

    } catch (err) {
        console.log(err.message)
        return [null, err.message];
    }
    
}


dbStartup();
// Exporting the methods
export  { getAllCustomers, getCustomerByID, resetCustomers, addCustomer };