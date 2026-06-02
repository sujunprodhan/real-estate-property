import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUser } from '../actions/server/auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { Collections, dbConnect } from './dbConnect';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });
        if (user) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        const { name, email, image } = user;
        try {
          const collection = await dbConnect(Collections.USER);
          const isExist = await collection.findOne({ email });
          if (!isExist) {
            const newUser = {
              provider: account.provider,
              name,
              email,
              image: image || '',
              role: 'user',
            };
            await collection.insertOne(newUser);
          }
          return true;
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (token?.email) {
        try {
          const collection = await dbConnect(Collections.USER);
          const dbUser = await collection.findOne({ email: token.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.provider = dbUser.provider;
          }
        } catch (error) {
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
