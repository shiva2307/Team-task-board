import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sign } from 'jsonwebtoken';

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Missing email or password');
        }

        return {
          id: credentials.email,
          email: credentials.email,
          name: 'Demo User'
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        token.accessToken = sign(
          {
            sub: user.id,
            email: user.email
          },
          secret,
          { expiresIn: '1h' }
        );
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }

      return session;
    }
  }
});

export default handler;

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}
