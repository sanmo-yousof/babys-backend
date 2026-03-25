import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.routes.js"
import cookieParser from "cookie-parser"

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser())


// routes
app.use("/api/auth", authRoutes);
app.use("/api/recipe",recipeRoutes);


app.get("/", (req, res) => {
  res.send("Server is running !!");
});

export { app };
