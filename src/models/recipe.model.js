import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    imageURL: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["breakfast", "lunch", "brunch", "dinner"],
    },

    preparationTime: {
      type: Number,
      required: true,
    },
    numberPersons: {
      type: Number,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    longDescription: {
      type: String,
      required: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "approved",
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true },
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
