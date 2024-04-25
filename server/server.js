import express from "express";
import path from "path"; // for handling file paths.
import bodyParser from "body-parser"; // for handling file paths.
import dotenv from "dotenv";// for enabling the .env file.
import {getAllCustomers, getCustomerByID,resetCustomers, addCustomer, updateCustomer, deleteCustomerByID} from "../data-server/data-access.js"; //Import 
import { fileURLToPath } from 'url';

const dotenvConfig = dotenv.config();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file.
const __dirname = path.dirname(__filename); // get the name of the directory.
// Start the express app object.
var app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 4000; // use env var or default to 4000.

// Set the static directory to serve files from.
app.use(express.static(path.join(__dirname, '../public')));

// appMiddleware middleware function
const appMiddleware = (req, res, next) => {
    // Get the expected header value from environment variable
    let expectedApiKeyValue = process.env.API_KEY;
    // Get the value of the custom header from the request
    const requestApiKeyValue = (req.headers['x-api-key']) ? req.headers['x-api-key'] : req.query.api_key;

    if (!requestApiKeyValue) {
        res.status(401).json({ message: 'Unauthorized: API Key is missing' }); // Respond with API Key is missing message
        
    } else {
       // Check if the request header matches the expected API_KEY value
        if (requestApiKeyValue === expectedApiKeyValue) {
            next(); // Allow access to the endpoint
        } else {
            res.status(403).json({ message: 'Unauthorized: API Key is invalid' }); // Respond with unauthorized status
        }
    }
    
};


// Add the get route.
app.get("/customers", appMiddleware, async (req, res)=> {
    const [cust, err] = await getAllCustomers();
    // adding error handler
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    } 
});

// Add the get customers by ID route.
app.get("/customers/:id", appMiddleware, async (req, res)=> {
    const [cust, err] = await getCustomerByID(req.params.id);
    // adding error handler
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    } 
});

// Add the get customers by ID route.
app.get("/reset", appMiddleware, async (req, res)=> {
    const [cust, err] = await resetCustomers();
    // adding error handler
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    } 
});

// Add the add new customer route.
app.post("/customers", appMiddleware, async (req, res)=> {
    // Getting the new customer data from the request body.
    const newCustomerInfo = req.body;

    // Checking if the body request is empty.
    if (Object.keys(newCustomerInfo).length === 0) {
        // notifying the error.
        res.status(400);
        res.send("missing request body, Please check your request and try again");
    } else {
        // Adding the new customer data into de mongodb database
        const [status, id, errMsg] = await addCustomer(newCustomerInfo);
        // Checking if the process above finished successfully or not.
        if(status === 'success'){
            res.status(201);
            let response = { ...newCustomerInfo };
            response["_id"] = id;
            res.send(response);
        }else{
            res.status(400);
            res.send(errMsg);
        }
    }
});

// Add the upodate customer data route.
app.put("/customers/:id", appMiddleware, async (req, res)=> {
    // Getting the new customer data from the request body.
    const updateCustomerInfo = req.body;
    const updateCustomerId = req.params.id;
    // Checking if the body request is empty.
    if (Object.keys(updateCustomerInfo).length === 0) {
        // notifying the error.
        res.status(400);
        res.send("missing request body, Please check your request and try again");
    } else {
        delete updateCustomerInfo._updateCustomerId;
        // Adding the new customer data into de mongodb database
        const [message, errMsg] = await updateCustomer(updateCustomerInfo);
        // Checking if the process above finished successfully or not.
        if(message){
            res.status(201);
            res.send(message);
        }else{
            res.status(400);
            res.send(errMsg);
        }
    }
});

// Add the delete customers by ID route.
app.delete("/customers/:id", appMiddleware, async (req, res)=> {
    const [cust, err] = await deleteCustomerByID(req.params.id);
    // adding error handler
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
