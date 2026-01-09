import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import connectDB from "../db/index.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
    try {
        await connectDB();
        
        const adminEmail = "ade@admin.crix";
        const adminPassword = "adminade"; // In production, use env var
        
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log("Admin with this email already exists.");
            process.exit(0);
        }

        const adminUser = await User.create({
            name: "Crix Admin",
            email: adminEmail,
            password: adminPassword,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
            role: "admin",
            isApproved: true,
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
