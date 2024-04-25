import dotenv from "dotenv";// for enabling the .env file.
import crypto from "crypto";// importing crypto lib.

dotenv.config();

let apiKey;
let apiKeysCollection = new Map();

const  setApiKey = () => {
    // Get the expected header value from environment variable
    apiKey = (process.env.API_KEY) ? process.env.API_KEY : '';

    // Check if the API key is provided as a command line argument and prioritize it
    const apiKeyFromCmd = process.argv.find(arg => arg.startsWith('--api-key='));
    if (apiKeyFromCmd) {
        // Setting the API_KEY value 
        apiKey = apiKeyFromCmd.split('=')[1];
        // Check if the API_KEY exists
    }
    if(apiKey && apiKey.length >0){
        process.env.API_KEY = apiKey
        apiKeysCollection.set('default', apiKey);
        displayApiKeysList();
    }else{
        // Stoping the process - and show up the error message
        console.error('API key is missing. Please provide it using --api-key=YOUR_API_KEY');
        process.exit(1);
    }
}

// Declaring appGenerateApiKeys method.
// Use this Method to generate a random API KEY.
const appGenerateApiKeys = (email) => {
    // generating the API KEY
    apiKey = crypto.randomBytes(14).toString('hex');
    //Pushing the email and the new API KEY into the apiKeysCollection
    apiKeysCollection.set(email, apiKey);
    // Setting the API_KEY value as default API KEY.
    displayApiKeysList();
    return 'The API KEY created for the email ' + email + ' is <b>' + apiKey +'</b>';

}

// Declaring appMiddleware method.
// Use this Method to allow or denie access to the app.
const appMiddleware = (req, res, next) => {
    let wrongApi = true;
    // Get the value of the custom header from the request
    const requestApiKeyValue = (req.headers['x-api-key']) ? req.headers['x-api-key'] : req.query.api_key;

    if (!requestApiKeyValue) {
        res.status(401).json({ message: 'Unauthorized: API Key is missing' }); // Respond with API Key is missing message
        
    } else {
        // Check if the request header matches the expected API_KEY value from the memory list.
        apiKeysCollection.forEach(stoeredApiKey => {
            if (stoeredApiKey == requestApiKeyValue) {
                next(); // Allow access to the endpoint
                wrongApi = false;
                return;
            }
            
        });
        if (wrongApi) {
            res.status(403).json({ message: 'Unauthorized: API Key is invalid' }); // Respond with unauthorized status
        }
    }
    
};


//Utils
const displayApiKeysList = () =>{
    console.log('API Keys list:')
    for(let entry of apiKeysCollection.entries()){
        console.log(entry)
    }
}
const validateEmail = (email) => {
    return email.match(/\S+@\S+\.\S+/)
}

setApiKey();
// Exporting the methods
export  { appMiddleware, appGenerateApiKeys, validateEmail };