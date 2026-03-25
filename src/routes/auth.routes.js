import express from "express";
import { createUser, loginUser, updateUser, currentUser,logoutUser } from "../controllers/auth.controller.js";
import verifyUser from "../middlewares/verifyUser.js";


const router = express.Router();

router.post("/create-user",createUser);
router.post("/login-user",loginUser);
router.patch("/update-user",verifyUser,updateUser);
router.get("/current-user",verifyUser,currentUser);
router.post("/logout-user",logoutUser);

export default router;