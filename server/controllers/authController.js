const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // console.log("login successful from backend", user);
    // Store user details in session
    req.session.userId = user._id;
    req.session.userName = user.name;
    res
      .status(200)
      .json({
        message: "Login successful",
        name: user.name,
        email: user.email,
        id: user._id,
      });
    return res;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user name controller
exports.getUserName = (req, res) => {
  try {
    const userName = req.session.userName;
    res.status(200).json({ userName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// module.exports = {
//     login
// };
