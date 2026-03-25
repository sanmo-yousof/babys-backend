import Recipe from "../models/recipe.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

// create recipe
const createRecipe = async (req, res) => {
  try {
    const {
      imageURL,
      title,
      category,
      preparationTime,
      numberPersons,
      shortDescription,
      longDescription,
    } = req.body;

    if (
      !imageURL ||
      !title ||
      !category ||
      !preparationTime ||
      !numberPersons ||
      !shortDescription ||
      !longDescription
    ) {
      return errorResponse(res, 400, "All fields are required");
    }

    const validCategories = ["breakfast", "lunch", "brunch", "dinner"];
    if (!validCategories.includes(category)) {
      return errorResponse(res, 400, "Invalid category");
    }

    const newRecipe = new Recipe({
      imageURL,
      title,
      category,
      preparationTime,
      numberPersons,
      shortDescription,
      longDescription,
      authorId: req.user._id,
    });

    if (newRecipe) {
      await newRecipe.save();
      return successResponse(res, 201, "Recipe created success");
    } else {
      return errorResponse(res, 400, "Invaild data");
    }
  } catch (error) {
    console.log("Error in createRecipe controller", error.message);
    return errorResponse(res);
  }
};

// get my recipe
const getMyRecipe = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipe = await Recipe.find({ authorId: userId }).sort({
      createdAt: -1,
    });

    if (!recipe.length) {
      return successResponse(res, 200, "No recipes found", []);
    }
    return successResponse(res, 200, "My recipes fetched successfully", recipe);
  } catch (error) {
    console.log("Error in getMyRecipe controller", error.message);
    return errorResponse(res);
  }
};

// update my recipe
const updateMyRecipe = async (req, res) => {
  try {
    const updateRecipeId = req.params.id;
    const userId = req.user._id;
    const {
      imageURL,
      title,
      category,
      preparationTime,
      numberPersons,
      shortDescription,
      longDescription,
    } = req.body;

    const recipe = await Recipe.findById(updateRecipeId);
    if (!recipe) {
      return errorResponse(res, 404, "Recipe not found");
    }

    if (recipe.authorId.toString() !== userId.toString()) {
      return errorResponse(res, 403, "Unauthorized to update this recipe");
    }

    if (category) {
      const validCategories = ["breakfast", "lunch", "brunch", "dinner"];
      if (!validCategories.includes(category)) {
        return errorResponse(res, 400, "Invalid category");
      }
    }

    const updatedFields = {
      imageURL,
      title,
      category,
      preparationTime,
      numberPersons,
      shortDescription,
      longDescription,
    };

    // remove undefined fields
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key],
    );

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      updateRecipeId,
      { $set: updatedFields },
      { new: true, runValidators: true },
    );

    return successResponse(
      res,
      200,
      "Recipe updated successfully",
      updatedRecipe,
    );
  } catch (error) {
    console.log("Error in updateMyRecipe controller", error.message);
    return errorResponse(res);
  }
};

export { createRecipe, getMyRecipe, updateMyRecipe };
