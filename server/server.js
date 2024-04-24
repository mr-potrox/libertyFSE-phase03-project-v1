import express from "express";
import path from "path"; // for handling file paths.
import {getAllCustomers, getCustomerByID} from "../data-server/data-access.js"; //Import 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file.
console.log(__filename)
const __dirname = path.dirname(__filename); // get the name of the directory.
console.log(__dirname)
// Start the express app object.
var app = express();
app.use(express.json());

const port = process.env.PORT || 4000; // use env var or default to 4000.

// Set the static directory to serve files from.
app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Add the get route.
app.get("/customers", async (req, res)=> {
    const cust = await getAllCustomers();
    res.send(cust);
});

// Add the get customers by ID route.
app.get("/customers/:id", async (req, res)=> {
    const cust = await getCustomerByID(req.params.id);
    res.send(cust);
});




