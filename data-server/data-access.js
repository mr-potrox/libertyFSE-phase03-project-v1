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

// Declaring getCustomerByID method.
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

// Declaring updateCustomer method - 
// Use this Method to update  the customer data into the mongodb database.
async function updateCustomer(updateCustomerInfo) {
    //Getting the customer id from the request
    const filter = {'id': updateCustomerInfo.id};
    //Getting the customer data to be updated form the reques
    const data = {'$set': updateCustomerInfo};
    try {
        // Creating the new record into the database
        const updateCustomerResult = await customersConecction.updateOne(filter, data);
        return ["success", updateCustomerResult.id, null];

    } catch (err) {
        console.log(err.message)
        return [null, err.message];
    }
    
}

// Declaring deleteCustomerByID method.
// Use this Method to delete the customer data filtered by ID from mongodb database.
async function deleteCustomerByID(id) {
    try {
        // Deleting the customer by ID from custbd on MongoDb 
        const deleteResult = await customersConecction.deleteOne({"id": +id});
        if(deleteResult.deletedCount === 0){
          return [ null, "No record deleted"];
        }else if(deleteResult.deletedCount === 1){
            return [ "One record deleted", null];
        } else{
            return [null, "error deleting records"]
        }
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
};

// Declaring searchCustomer method.
// Use this Method to search the customer data filtered by name, email,
// password from mongodb database.
async function searchCustomer(queryObject) {
    try {
        // Searchung the user from custbd on MongoDb 

        const searchResult = await customersConecction.find(queryObject).toArray();
        if(!searchResult || searchResult.length === 0 ){
            return [ null, "no matching customer documents found"];
        }
        return [searchResult, null];
      } catch (err) {
        console.log(err.message);
        return [null, err.message];
      }
};

const generateCustomerId = () => {
    const customers = customersConecction.find().toArray();
    const nextCustId = 'CUST' + Math(customers.length ++)
    console.log(nextCustId)
}
dbStartup();
// Exporting the methods
export  { getAllCustomers, getCustomerByID, resetCustomers, 
        addCustomer, updateCustomer, deleteCustomerByID, searchCustomer };