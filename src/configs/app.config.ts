import express from 'express'
const appConfig = (app: express.Express) => 
{
    //Receiving data 
    app.use(express.json()) 
    app.use(express.urlencoded({extended : true}))
    
}

export default appConfig