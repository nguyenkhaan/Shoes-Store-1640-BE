import { Router } from "express";
import AuthRoute from "~/routes/auth/route";
import AdminRoute from "~/routes/admin/route"
import PublicColorRoute from "~/routes/color/route"
import PublicBrandRoute from "~/routes/brand/route"
import PublicSizeRoute from "~/routes/size/route"
import UserRoute from "~/routes/user/route"
import CartRoute from "~/routes/cart/route"
import ImageRouter from "~/routes/image.route";
import paymentRoute from "~/routes/payment/route";
import ProductRoute from "~/routes/product/route"
import ProductVarientRoute from "~/routes/variant/route"
import OrderRoute from "~/routes/order/route"
const api = Router().use('/auth' , AuthRoute) 
//Admin route 
api.use('/admin' , AdminRoute)
api.use('/user' , UserRoute)
//Public Route 
api.use('/colors' , PublicColorRoute)
api.use('/brands' , PublicBrandRoute)
// api.use('/sizes', PublicSizeRoute)
api.use('/', ImageRouter)   //Cai nay dung de test chuc nang upload anh. Sau khi cai dat xong chuc nang upload vao cac noi can thiet thi hay xoa cai nay 
api.use('/cart' , CartRoute)
api.use('/payment', paymentRoute);
api.use('/product', ProductRoute)
api.use('/variant' , ProductVarientRoute)
api.use('/order' , OrderRoute)
export default Router().use("/api", api);
