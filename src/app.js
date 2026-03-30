import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(cors({
  
  origin: 
  process.env.NODE_ENV === "production"
  ?process.env.CLIENT_URL
  :["http://localhost:5173", "http://192.168.68.83:5173"],
  credentials: true,
}));
 
app.use(express.json());
app.use(cookieParser());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/recipe", recipeRoutes);
// app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Server is running !!");
});

export { app };
