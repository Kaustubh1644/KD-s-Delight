import userModal from "./../modals/userModal.js";
import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";
import validator from "validator";

//Login Function
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user Doesn't Exist" });
    }

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Creds" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//    Create A Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register Function
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const exists = await userModal.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    // validation
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: " Please Enter a valid Email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    //  If Everthing Works fine
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    // New User

    const newUser = new userModal({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export {loginUser, registerUser}