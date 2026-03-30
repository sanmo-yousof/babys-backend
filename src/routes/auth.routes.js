import express from "express";
import { createUser, loginUser, updateUser, currentUser,logoutUser, getUsers } from "../controllers/auth.controller.js";
import verifyUser from "../middlewares/verifyUser.js";


const router = express.Router();

router.post("/create-user",createUser);
router.post("/login-user",loginUser);
router.patch("/update-user",verifyUser((["user"])),updateUser);
router.get("/current-user",verifyUser(["user"]),currentUser);
router.post("/logout-user",logoutUser);

// admin 
// router.get("/users",verifyUser(["admin"]),getUsers)

export default router;