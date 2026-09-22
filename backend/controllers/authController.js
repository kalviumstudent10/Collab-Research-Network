const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClient = new OAuth2Client();

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function register(req, res) {
  try {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "Username, name, email, and password are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username or email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username: normalizedUsername,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Unable to create account" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    const passwordMatches = user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(200).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to sign in" });
  }
}

function usernameFromEmail(email) {
  return email.split("@")[0].replace(/[^a-z0-9_]/g, "").slice(0, 24) || "researcher";
}

async function uniqueUsername(email) {
  const baseUsername = usernameFromEmail(email);
  let username = baseUsername;
  let suffix = 1;

  while (await User.exists({ username })) {
    username = `${baseUsername.slice(0, 30 - String(suffix).length - 1)}_${suffix}`;
    suffix += 1;
  }

  return username;
}

async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ message: "Google authentication is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.email_verified) {
      return res.status(401).json({ message: "Google account could not be verified" });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        username: await uniqueUsername(email),
        name: payload.name || email.split("@")[0],
        email,
        password: crypto.randomBytes(32).toString("hex"),
        profilePicture: payload.picture,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      if (payload.picture && !user.profilePicture) user.profilePicture = payload.picture;
      await user.save();
    }

    return res.status(200).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    console.error("Google authentication failed:", error.message);
    return res.status(401).json({ message: "Unable to sign in with Google" });
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({ user: publicUser(req.user) });
}

module.exports = { register, login, googleLogin, getCurrentUser };