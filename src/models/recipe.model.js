import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      required: true,
    },
    author_id: {
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
    },
    preparation_time: {
      type: Number,
      required: true,
    },
    number_persons: {
      type: Number,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    long_description: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Recipe = mongoose.model("Recipe",recipeSchema);

export default Recipe;

