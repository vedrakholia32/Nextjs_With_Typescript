import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connect();
    
    const reqbody = await request.json();
    const { username, email, password } = reqbody;

    console.log("Request body:", reqbody);

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Please provide username, email, and password" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User created:", savedUser._id);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle specific MongoDB connection errors
    if (error.name === 'MongooseServerSelectionError') {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Validation failed: " + error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
