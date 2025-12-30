import { Router } from "express";
import AuthRoute from "~/routes/auth.route";

const api = Router().use('/auth' , AuthRoute) 

export default Router().use('/api' , api)