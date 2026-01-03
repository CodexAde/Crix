import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import connectDB from "../db/index.js";

dotenv.config(); // Load from current directory

const seedAdmin = async () => {
    try {
        await connectDB();
        
        const adminEmail = "admin@crix.com";
        const adminPassword = "admin"; // In production, use env var
        
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const adminUser = await User.create({
            name: "Crix Admin",
            email: adminEmail,
            password: adminPassword,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
            academicInfo: {
                college: "Crix HQ",
                branch: "ADMIN",
                year: 4,
                isOnboarded: true
            }
        });

        console.log("Admin user created successfully:", adminUser.email);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
