import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_ID!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      //console.log(token)
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );
     // console.log(encodedToken)
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret);
      console.log(decodedToken)
      return decodedToken as JWT;
    },
  },
  theme: {
    colorScheme: "dark",
    logo: "/logo.png",
  },
  callbacks: {
    async session({ session }) {
      // console.log('SESSOIN',session)

      const email = session?.user?.email as string
      try {
        const data = await getUser(email) as {user?:UserProfile}
        console.log(data)
        const newsession = {...session , user : {
            ...session.user,
            ...data?.user
        }}
        console.log(newsession)
      return newsession;
      } catch (error) {
        console.log('error in session ',error)
      }
      return session;
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        //get user if exist
        const userExists = (await getUser(user?.email as string)) as {
          user?: UserProfile;
        };
        console.log(userExists)
        //else create them
        if (!userExists) {
          await createUser(
            user.name as string,
            user.email as string,
            user.image as string
          );
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as SessionInterface;
  //console.log('SESSION',session)
  return session;
}
 