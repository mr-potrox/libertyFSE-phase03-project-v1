import dotenv from "dotenv";// for enabling the .env file.
const dotenvConfig = dotenv.config();

// Get the expected header value from environment variable
let envApiKeyValue = process.env.API_KEY;
// Check if the API key is provided as a command line argument and prioritize it
const apiKeyFromCmd = process.argv.find(arg => arg.startsWith('--api-key='))
if (apiKeyFromCmd) {
    // Setting the API_KEY value 
    envApiKeyValue = process.env.API_KEY = apiKeyFromCmd.split('=')[1];
    // Check if the API_KEY exists
}else if(!envApiKeyValue){
    // Stoping the process - and show up the error message
    console.error('API key is missing. Please provide it using --api-key=YOUR_API_KEY');
    process.exit(1);
}

// appMiddleware middleware function
const appMiddleware = (req, res, next) => {

    // Get the value of the custom header from the request
    const requestApiKeyValue = (req.headers['x-api-key']) ? req.headers['x-api-key'] : req.query.api_key;

    if (!requestApiKeyValue) {
        res.status(401).json({ message: 'Unauthorized: API Key is missing' }); // Respond with API Key is missing message
        
    } else {
       // Check if the request header matches the expected API_KEY value
        if (requestApiKeyValue === envApiKeyValue) {
            next(); // Allow access to the endpoint
        } else {
            res.status(403).json({ message: 'Unauthorized: API Key is invalid' }); // Respond with unauthorized status
        }
    }
    
};

// Exporting the methods
export  { appMiddleware };