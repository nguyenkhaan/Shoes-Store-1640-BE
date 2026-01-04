import { Router } from "express";
import AuthRoute from "~/routes/auth.route";
import AdminRoute from "~/routes/admin.route"
const api = Router().use('/auth' , AuthRoute).use('/admin' , AdminRoute)

export default Router().use('/api' , api)