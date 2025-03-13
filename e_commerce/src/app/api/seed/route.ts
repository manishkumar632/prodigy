import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    // Only allow seeding in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Seeding is only allowed in development environment' },
        { status: 403 }
      );
    }
    
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({ message: 'Database seeded successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to seed database', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 