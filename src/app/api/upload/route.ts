import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    console.log('Starting upload process...');
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const email = formData.get('email') as string;

        console.log('Form data received:', {
            hasFile: !!file,
            fileName: file?.name,
            fileType: file?.type,
            email: email
        });

        if (!file || !email) {
            console.log('Missing data:', { hasFile: !!file, hasEmail: !!email });
            return NextResponse.json({ error: 'Missing file or email' }, { status: 400 });
        }

        console.log('Processing file...');
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
        console.log('File processed successfully');

        console.log('Connecting to database...');
        await connectDB();

        console.log('Finding user:', email);
        const existingUser = await User.findOne({ email });
        console.log('User found:', !!existingUser);

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('Updating profile picture...');
        const result = await User.updateOne(
            { email },
            { $set: { profilePicture: base64Image } }
        );

        console.log('Update result:', result);

        if (result.modifiedCount === 0) {
            console.log('No document was modified');
            return NextResponse.json({ error: 'Failed to update profile picture' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Profile picture updated successfully',
            profilePicture: base64Image
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Error uploading image',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}