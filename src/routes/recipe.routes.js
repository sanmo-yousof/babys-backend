import express from "express"
import verifyUser from "../middlewares/verifyUser.js";
import { createRecipe, deleteMyRecipe, getAllRecipe, getMyRecipe, getNewFreshPopularRecipe, getRecipe, getSingleRecipe, updateMyRecipe, updateStatus } from "../controllers/recipe.controller.js";


const router = express.Router();


router.post("/create-recipe",verifyUser(["user"]), createRecipe);
router.get("/my-recipe",verifyUser(["user"]),getMyRecipe);
router.patch("/update-recipe/:id",verifyUser(["user"]),updateMyRecipe);
router.delete("/delete-recipe/:id",verifyUser(["user"]),deleteMyRecipe);
router.get("/all-recipe",getAllRecipe);
router.get("/new-fresh-popular-recipe",getNewFreshPopularRecipe);
router.get("/single-recipe/:id",getSingleRecipe);

// admin 
// router.get("/recipe",verifyUser(["admin"]),getRecipe);
// router.patch("/update-status/:id",verifyUser(["admin"]),updateStatus);



export default router;