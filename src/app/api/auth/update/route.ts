import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email, username } = await req.json();

        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { username } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'User updated successfully',
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}