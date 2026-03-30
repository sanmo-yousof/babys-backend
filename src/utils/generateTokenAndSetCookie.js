import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
 const isProduction = process.env.NODE_ENV === "production";

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, 
    secure: isProduction,   
    sameSite: isProduction ? "none" : "lax", 
    path:"/",

  });
};

export default generateTokenAndSetCookie;
