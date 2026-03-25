import express from "express"
import verifyUser from "../middlewares/verifyUser.js";
import { createRecipe, getMyRecipe, updateMyRecipe } from "../controllers/recipe.controller.js";

const router = express.Router();


router.post("/create-recipe",verifyUser,createRecipe);
router.get("/my-recipe",verifyUser,getMyRecipe);
router.patch("/update-recipe/:id",verifyUser,updateMyRecipe);


export default router;