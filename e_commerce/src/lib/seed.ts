import bcrypt from 'bcryptjs';
import { connectToMongoose } from './mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    isAdmin: false,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 10),
    isAdmin: false,
  },
];

const products = [
  {
    name: 'Men\'s Classic T-Shirt',
    description: 'A comfortable and stylish t-shirt for everyday wear.',
    price: 29.99,
    category: 'men',
    subcategory: 't-shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    inStock: true,
    featured: true,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Men\'s Slim Fit Jeans',
    description: 'Modern slim fit jeans with a comfortable stretch.',
    price: 49.99,
    category: 'men',
    subcategory: 'jeans',
    sizes: ['30x32', '32x32', '34x32', '36x32'],
    colors: ['Blue', 'Black', 'Grey'],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    inStock: true,
    featured: false,
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: 'Men\'s Casual Shirt',
    description: 'A versatile button-up shirt for casual or semi-formal occasions.',
    price: 39.99,
    category: 'men',
    subcategory: 'shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    inStock: true,
    featured: true,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: 'Women\'s Summer Dress',
    description: 'A light and flowy dress perfect for summer days.',
    price: 45.99,
    category: 'women',
    subcategory: 'dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral', 'Blue', 'Red'],
    images: [
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    numReviews: 20,
  },
  {
    name: 'Women\'s Skinny Jeans',
    description: 'Classic skinny jeans with a comfortable stretch.',
    price: 54.99,
    category: 'women',
    subcategory: 'jeans',
    sizes: ['25', '26', '27', '28', '29', '30'],
    colors: ['Blue', 'Black', 'White'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    inStock: true,
    featured: false,
    rating: 4.4,
    numReviews: 18,
  },
  {
    name: 'Women\'s Blouse',
    description: 'An elegant blouse suitable for work or casual wear.',
    price: 34.99,
    category: 'women',
    subcategory: 'tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Pink'],
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    inStock: true,
    featured: true,
    rating: 4.6,
    numReviews: 14,
  },
];

export async function seedDatabase() {
  try {
    await connectToMongoose();
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    // Insert users
    await User.insertMany(users);
    console.log('Users seeded successfully');
    
    // Insert products
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    
    console.log('Database seeded successfully');
    
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
} 