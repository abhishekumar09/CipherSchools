// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";

// export const signup = async (req, res) => {
//   try {
//     const { name, email, password, confirmpassword } = req.body;
//     if (password !== confirmpassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }
//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     //Hashing the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await new User({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     await newUser
//       .save()
//       .then(() =>
//         res.status(201).json({ message: "User registered successfully" })
//       );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// logics define here 

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";                                              // libraray use for hash the password
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {                                  // export use because hmein signup ka route create krenge aur usmein rkhenge post request means usmein information provide krenge
  try {                                                                       // try catch use krte hein ki error n aayee 
    const { name, email, password, confirmpassword } = req.body;              // ye sb chizein req.body se aa rhi hein (postman)
       // Validate password and confirmation password
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });      // 400 use for showing data invalid
    }
        // Check if the email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({                                          // Registring the new user means (signup)
      name,
      email,
      password: hashedPassword,
    });
        // Save the new user in the database
    await newUser.save();                                                     // .save use for saving the user data kyunki use dubara signup n krna pde
    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
      // Check if the user exists in the database
  try {
    const user = await User.findOne({ email });                              // await use for serisleise result avoid from ulta pulta result
    const isMatch = await bcrypt.compare(password, user.password);           // it use for matching the password       // Compare the password with the hashed password in the database
    if (!user || !isMatch) {
      return res.status(404).json({ message: "invalid User or Password" });
    }
        // If successful, create token and send response
    createTokenAndSaveCookie(user._id, res);                                // jb login hojaye uske pass toke hona chaiye
    res.status(201).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};









// async - use for function perform krne k liye  aur jitni bhi promises hei use handle krane ke liye 
// await - jb bhi hm data bhj rhe hote hein use aane mein time lgta hei isliye yeh dono use krte hein await use for waiting

// jhan jhan databsae aa rha hei vhan await ko use krein