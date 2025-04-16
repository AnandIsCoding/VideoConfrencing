import chalk from "chalk";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { strict } from "node:assert";

export const registerUserController = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;
    if (!userEmail || !userName || !userPassword)
      return req.status(302).json({
        success: false,
        message: "Required Field Missing",
        error: "Required Field Missing",
      });
    const userExists = await User.findOne({ userEmail });
    if (userExists)
      return res.status(302).json({
        success: false,
        message: "User Already Exists",
        error: "User Already Exists",
      });
    // now hash the password
    const encryptedPassword = await bcrypt.hash(userPassword, 10);
    //create new user
    const user = await User.create({
      userName,
      userEmail,
      userPassword: encryptedPassword,
    });

    const userToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });
    res.cookie("userToken", userToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
      secure: process.env.NODE_ENV === "production",
      secure: true,
    });
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      user: user,
      userToken: userToken,
    });
  } catch (error) {
    if(error.code === 'ECONNRESET') return res.status(500).json({ success: false, message: "Server connection lost. Please retry." }); 
    console.log(
      "Error in registerUserController in user.controller.js ---->> ",
      chalk.bgRed(error.message)
    );
    return res
      .status(503)
      .json({
        success: false,
        message: "Internal Server Error",
        error: "Internal Server Error",
      });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    if (!userEmail || !userPassword) {
      return res
        .status(302)
        .json({
          success: false,
          message: "Required Field Missing",
          error: "Required Field Missing",
        });
    }
    const user = await User.findOne({ userEmail });
    if (!user)
      return res
        .status(404)
        .json({
          success: false,
          message: "User Not Found",
          error: "User not found",
        });
    const matchPassword = await bcrypt.compare(userPassword, user.userPassword);
    if (!matchPassword)
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid Credentials",
          error: "Invalid Credentials",
        });

    const userToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    return res.cookie('userToken',userToken,{
        httpOnly:true,
        sameSite:"strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        secure: process.env.NODE_ENV === "production",
    }).json({
        message: "User Login successfull",
        success: true,
        user,
        userToken: userToken,
      });
  } catch (error) {
    if(error.code === 'ECONNRESET') return res.status(500).json({ success: false, message: "Server connection lost. Please retry." });
    console.log(
      "Error in login User Controller --->> ",
      chalk.bgRed(error.message)
    );
    return res
      .status(503)
      .json({
        success: false,
        message: "Internal Server Error",
        error: "Internal Server Error",
      });
  }
};
