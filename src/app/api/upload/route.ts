import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'daj1lyfgk', // from the user's video URLs
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check if Cloudinary keys exist
    if (!process.env.CLOUDINARY_API_SECRET) {
      console.warn('Missing Cloudinary API secret. Returning mock URL.');
      // Fallback for development if keys aren't added yet
      return NextResponse.json({
        url: 'https://res.cloudinary.com/daj1lyfgk/image/upload/v1700000000/placeholder.jpg',
        mock: true
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'ibiza-mi-vida-listings',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Error uploading image' },
      { status: 500 }
    );
  }
}
