import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { errorResponse } from "../utils/response.js";

const verifyUser = (roles = []) => {
  return async(req,res,next) => {
  try {
    const token = req.cookies.jwt;
    if(!token){
        return errorResponse(res,401,"Unauthorized - No token Provided");
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
        return errorResponse(res,401, "Unauthorized - Invalid token")
    }

    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        return errorResponse(res,404,"User not found")
    }

    if(roles.length && !roles.includes(user.role)){
      return errorResponse(res,403,"Forbidden -Access denied")
    }

    req.user = user
    next()
    
  } catch (error) {
    console.log("Error in verifyUser middleware",error.message);
    return errorResponse(res);
  }
}
}


export default verifyUser ;