import { Router } from "express";
import User from "~/controllers/user.controller";
const router = Router();

router.get("/user", User.getAllUsers) 

export default router;
