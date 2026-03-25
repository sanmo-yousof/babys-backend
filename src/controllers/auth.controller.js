import User from "../models/user.model.js";
import { comparePassword } from "../utils/comparePassword.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { hashPassword } from "../utils/hashPassword.js";
import { errorResponse, successResponse } from "../utils/response.js";

// creat user controller
const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      birthday,
      password,
      confirmPassword,
      imageURL,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !birthday ||
      !password ||
      !confirmPassword
    ) {
      return errorResponse(res, 400, "All fields are required");
    }

    if (password !== confirmPassword) {
      return errorResponse(res, 400, "Password doesn't match");
    }

    // check existing user
    const user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 400, "Email already exists");
    }

    // password hashedPassword
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      birthday,
      password: hashedPassword,
      imageURL,
    });

    if (newUser) {
      const saveUser = await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);
      const userObj = saveUser.toObject();
      delete userObj.password;
      delete userObj.__v;

      return successResponse(res, 201, "User created success", userObj);
    } else {
      return errorResponse(res, 400, "Invaild data");
    }
  } catch (error) {
    console.log("Error in createUser controller", error.message);
    return errorResponse(res);
  }
};

// login user controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "All fields are required");
    }

    // check user is in DB
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, "Email is incorrect");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 401, "Password is incorrect");
    }

    generateTokenAndSetCookie(user._id, res);
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    return successResponse(res, 200, "User login success", userObj);
  } catch (error) {
    console.log("Error in loginUser controller", error.message);
    return errorResponse(res);
  }
};

// update user 
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(req.body)

    const {
      firstName,
      lastName,
      birthday,
      imageURL,
      password,
      confirmPassword,
    } = req.body;
    let updatedFields = {
      firstName,
      lastName,
      birthday,
      imageURL,
    };

    // remove undefined fields (not sent in body)
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key],
    );

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return errorResponse(res, 400, "Password doesn't match");
      }
      updatedFields.password = await hashPassword(password);
    }

    // update user 
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {$set:updatedFields},
      {new:true,runValidators:true}
    ).select("-password -__v");

    if(!updateUser){
      return errorResponse(res,404,"User not found")
    }

    // response 
    return successResponse(res,200,"Profile updated success",updateUser)
  } catch (error) {
    console.log("Error in updateUser controller", error.message);
    return errorResponse(res);
  }
};

// current user
const currentUser = async (req, res) => {
  try {
    return successResponse(res, 200, "User data fetch success", req.user);
  } catch (error) {
    console.log("Error in currentUser controller", error.message);
    return errorResponse(res);
  }
};

// logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return successResponse(res, 200, "Log out success");
  } catch (error) {
    console.log("Error in logoutUser controller", error.message);
    return errorResponse(res);
  }
};

export { createUser, loginUser, updateUser, currentUser, logoutUser };
