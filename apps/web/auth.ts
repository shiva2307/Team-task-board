import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sign } from 'jsonwebtoken';

type CredentialsInput = {
  email: string;
  password: string;
};

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut
} = NextAuth({
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

        const { email } = credentials as CredentialsInput;

        return {
          id: email,
          email,
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

        const mutableToken = token as typeof token & { accessToken?: string };
        mutableToken.accessToken = sign(
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
      const sessionWithToken = session as typeof session & { accessToken?: string };
      const tokenWithAccess = token as typeof token & { accessToken?: string };

      if (tokenWithAccess.accessToken) {
        sessionWithToken.accessToken = tokenWithAccess.accessToken;
      }

      return sessionWithToken;
    }
  }
});
