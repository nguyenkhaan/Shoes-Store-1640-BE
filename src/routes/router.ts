import { Router } from "express";
import AuthRoute from "~/routes/auth/route";
import AdminRoute from "~/routes/admin/route"
import PublicColorRoute from "~/routes/color/route"
import PublicBrandRoute from "~/routes/brand/route"
const api = Router().use('/auth' , AuthRoute) 
//Admin route 
api.use('/admin' , AdminRoute)

//Public Route 
api.use('/colors' , PublicColorRoute)
api.use('/brands' , PublicBrandRoute)



export default Router().use('/api' , api)