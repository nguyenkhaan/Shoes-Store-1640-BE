import express from 'express'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const appConfig = (app: express.Express) => 
{
    //Receiving data 
    app.use(
        cors({
          origin: true,         
          credentials: true,   
        })
      );
    app.use(express.json())    //json 
    app.use(express.urlencoded({extended : true})) //form - data 
    app.use(express.static('~/templates'))
    app.use(cookieParser())
}

export default appConfig