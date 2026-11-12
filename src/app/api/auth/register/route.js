import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'zipup_super_secret_jwt_key_2026';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide name, email, and password.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    try {
      await connectDB();
    } catch (dbErr) {
      console.error('Database connection error in register:', dbErr);
      return NextResponse.json(
        { error: 'Database connection failed. Please ensure MongoDB is running or MONGODB_URI is set.' },
        { status: 503 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed.' },
      { status: 500 }
    );
  }
}
