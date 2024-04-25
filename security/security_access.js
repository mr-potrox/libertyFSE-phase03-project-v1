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

// Exporting the methods
export  { appMiddleware };