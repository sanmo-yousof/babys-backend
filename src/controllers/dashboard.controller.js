import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

const getStatics = async (req, res) => {
  try {
    const [totalUsers, totalRecipes, approvedRecipes, pendingRecipes] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Recipe.countDocuments(),
        Recipe.countDocuments({ status: "approved" }),
        Recipe.countDocuments({ status: "pending" }),
      ]);
    const data = {totalUsers, totalRecipes, approvedRecipes, pendingRecipes};

    return successResponse(res, 200, "Dashboard statics fetch success", data);
  } catch (error) {
    console.log("Error in getStatics controller", error.message);
    return errorResponse(res);
  }
};

export { getStatics };
