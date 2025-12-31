enum HttpStatus  {  
    //2xx 
    OK = 200, 
    CREATED = 201, 
    ACCEPTED = 202, 
    //3xx 
    BAD_REQUEST = 400, 
    UNAUTHORIZED = 401, 
    FORBIDDEN = 403, 
    NOT_FOUND = 404, 
    CONFLICT = 409, 
    PAYMENT_REQUIRED = 402, 
    TOO_MANY_REQUESTS = 429, //Use for rate limits 
    //5xx 
    INTERNAL = 500, 
    UNVAILABLE = 503 
}    

export default HttpStatus