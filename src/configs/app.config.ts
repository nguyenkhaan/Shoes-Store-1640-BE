import express from 'express'
import path from 'node:path'
const appConfig = (app: express.Express) => 
{
    //Receiving data 
    app.use(express.json())    //json 
    app.use(express.urlencoded({extended : true})) //form - data 
    app.use(express.static('~/templates'))
}

export default appConfig