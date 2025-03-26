import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        return NextResponse.json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error during login' }, { status: 500 });
    }
}