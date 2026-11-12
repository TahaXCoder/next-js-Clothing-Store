import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'zipup_super_secret_jwt_key_2026';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    try {
      await connectDB();
    } catch (dbErr) {
      console.error('Database connection error in /auth/me:', dbErr);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
