import mongoose from "mongoose";
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

    await newRecipe.save();
    return successResponse(res, 201, "Recipe created success");
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

// get single recipe
const getSingleRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return errorResponse(res, 400, "Invalid recipe ID");
    }
    const data = await Recipe.findById(recipeId);
    if (!data) {
      return errorResponse(res, 404, "Recipe not found!");
    }
    return successResponse(res, 200, "Recipe fetch success!", data);
  } catch (error) {
    console.log("Error in getSingleRecipe controller", error.message);
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

// delete my recipe
const deleteMyRecipe = async (req, res) => {
  try {
    const deleteRecipeId = req.params.id;
    const userId = req.user._id;

    const recipe = await Recipe.findById(deleteRecipeId);
    if (!recipe) {
      return errorResponse(res, 404, "Recipe not found");
    }

    if (recipe.authorId.toString() !== userId.toString()) {
      return errorResponse(res, 403, "Unauthorized to delete this recipe");
    }

    await Recipe.findByIdAndDelete(deleteRecipeId);

    return successResponse(res, 200, "Recipe deleted successfully");
  } catch (error) {
    console.log("Error in deleteMyRecipe controller", error.message);
    return errorResponse(res);
  }
};

// all aprove recipe
const getAllRecipe = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = { status: "approved" };

    if (category) {
      const validCategories = ["breakfast", "lunch", "brunch", "dinner"];

      if (!validCategories.includes(category)) {
        return errorResponse(res, 400, "Invalid category");
      }
      filter.category = category;
    }
    const recipe = await Recipe.find(filter).sort({ createdAt: -1 });
    return successResponse(res, 200, "Recipes fetched success", recipe);
  } catch (error) {
    console.log("Error in getAllRecipe controller", error.message);
    return errorResponse(res);
  }
};

// get fresh,new and most popular
const getNewFreshPopularRecipe = async (req, res) => {
  try {
    let filter = { status: "approved" };

    const newRecipe = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .limit(3);
    const popularRecipe = await Recipe.find(filter)
      .sort({ likes: -1 })
      .limit(6);

    const recipes = {
      newRecipe,
      popularRecipe,
    };

    return successResponse(
      res,
      200,
      "New, fresh and popular recipe fetched success",
      recipes,
    );
  } catch (error) {
    console.log("Error in getNewPopularRecipe controller", error.message);
    return errorResponse(res);
  }
};

// admin

// all recipe
const getRecipe = async (req, res) => {
  try {
    // const recipe = await Recipe.find().sort({createdAt:-1});
    const recipe = await Recipe.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          authorEmail: { $arrayElemAt: ["$user.email", 0] },
        },
      },
      {
        $project: {
          user: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return successResponse(res, 200, "All recipe fetched success", recipe);
  } catch (error) {
    console.log("Error in getRecipe controller", error.message);
    return errorResponse(res);
  }
};

// update status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const recipeId = req.params.id;
    const statusArr = ["pending", "approved", "rejected"];

    if (!status || !statusArr.includes(status)) {
      return errorResponse(res, 400, "Invalid status");
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { status },
      { returnDocument: "after" },
    );

    if (!updatedRecipe) {
      return errorResponse(res, 404, "Recipe not found");
    }

    return successResponse(res, 200, "Recipe status updated", updatedRecipe);
  } catch (error) {
    console.log("Error in updateStatus controller", error.message);
    return errorResponse(res);
  }
};

export {
  createRecipe,
  getMyRecipe,
  updateMyRecipe,
  deleteMyRecipe,
  getAllRecipe,
  getNewFreshPopularRecipe,
  getRecipe,
  updateStatus,
  getSingleRecipe,
};
