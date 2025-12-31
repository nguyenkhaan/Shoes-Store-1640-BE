enum HttpStatus  {   //Use for controller 
    //2xx 
    OK = 200, 
    CREATED = 201, 
    //3xx 
    BAD_REQUEST = 400, 
    UNAUTHORIZED = 402, 
    FORBIDDEN = 403, 
    NOT_FOUND = 401, 
    CONFLICT = 409, 
    //5xx 
    INTERNAL = 500, 
    UNVAILABLE = 503 
}    

export default HttpStatus