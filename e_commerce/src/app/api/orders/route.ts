import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoose } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get all orders (admin) or user orders (regular user)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToMongoose();
    
    // If admin, get all orders, otherwise get only user's orders
    const query = session.user.isAdmin ? {} : { user: session.user.id };
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const orderData = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'orderItems', 'shippingAddress', 'paymentMethod',
      'itemsPrice', 'shippingPrice', 'taxPrice', 'totalPrice'
    ];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    await connectToMongoose();
    
    // Create new order with user ID from session
    const order = await Order.create({
      ...orderData,
      user: session.user.id,
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 