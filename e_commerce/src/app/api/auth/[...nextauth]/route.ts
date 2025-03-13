import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define admin user
const adminUser = {
  id: 'admin-user',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  isAdmin: true,
};

// Define regular users for testing
const users = [
  adminUser,
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    isAdmin: false,
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    isAdmin: false,
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Check if it's the admin user
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return adminUser;
        }

        // Check if it's a regular user (for testing)
        // In a real app, you would check against the database
        if (credentials.password === 'password123') {
          const user = users.find(user => user.email === credentials.email);
          if (user) {
            return user;
          }
        }

        // If no user is found or password is incorrect
        throw new Error('Invalid email or password');
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 