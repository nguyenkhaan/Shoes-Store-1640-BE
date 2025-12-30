import express from 'express'
const appConfig = (app: express.Express) => 
{
    //Receiving data 
    app.use(express.json())    //json 
    app.use(express.urlencoded({extended : true})) //form - data 
    
}

export default appConfig