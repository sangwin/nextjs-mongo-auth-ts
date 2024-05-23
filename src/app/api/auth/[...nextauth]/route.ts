import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

export const authOptions: any = {
  // Configure one or more authentication providers
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          console.log("🚀 ~ authorize ~ user:", user)
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            console.log("🚀 ~ authorize ~ user:", user)
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({token, user, account, profile, isNewUser}: any) {
        user && (token.user = user)
        return token
    },
    async session({session, token, user}: any) {
        // console.log("🚀 ~ session ~ token:", token)
        // console.log("🚀 ~ session ~ user:", user)
        session = {
            ...session,
            user: {
                id: token.user._id,
                ...session.user
            }
        }
        console.log("🚀 ~ session ~ session:", session)
        return session
    },
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider == "credentials") {
        return true;
      }
      if (account?.provider == "github") {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              name: 'user.name',
              email: user.email,
              image: 'user.image',
              phone: 'user.phone',
              some: 'user.some',
              cap: 'user.cap'
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
