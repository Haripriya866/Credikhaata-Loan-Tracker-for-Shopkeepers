const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.registerUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return response.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { userId: newUser._id, email: newUser.email },
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
};

// Login existing user
exports.loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return response.status(200).json({
      success: true,
      message: "Login successful.",
      data: { token },
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
};
