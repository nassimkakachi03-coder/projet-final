import bcrypt from "bcrypt";
import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";

// Create a default admin user if the database is empty!
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@drkakachi.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Dr. Kakachi",
        email: "admin@drkakachi.com",
        role: "Admin",
        password: hashedPassword,
      });
      console.log("Admin user seeded into MongoDB: admin@drkakachi.com");
    }
  } catch (error) {
    console.error("Failed to seed admin", error);
  }
};
// Seed immediately
setTimeout(seedAdmin, 3000);

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error("User with this email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword });

  const token = generateToken(user._id.toString(), user.role || "Receptionist");
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id.toString(), user.role || "Receptionist");
  return { user, token };
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};
