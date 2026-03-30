import express from "express"
import verifyUser from "../middlewares/verifyUser.js";
import { getStatics } from "../controllers/dashboard.controller.js";


const router = express.Router();

// router.get("/statics",verifyUser(["admin"]),getStatics)




export default router;