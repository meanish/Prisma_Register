import NextAuth from "next-auth/next";
import prisma from './libs/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import LINKEDIN from "next-auth/providers/linkedin";
import bcrypt from 'bcrypt'
import { getToken } from "next-auth/jwt";
import { getUserByEmail, getUserById } from "./app/data/user";
import { generateVerificationToken } from "./libs/tokens";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        LINKEDIN({
            clientId: process.env.LINKEDIN_ID,
            clientSecret: process.env.LINKEDIN_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Facebook({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),

        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text", placeholder: "John Smith" },
            },
            async authorize(credentials, req) {


                console.log("Credentials", credentials, req)


                // check to see if email and password is there
                if (!credentials.email || !credentials.password) {
                    throw new Error('Please enter an email and password')
                }

                const existingUser = await getUserByEmail(credentials.email)

                console.log("Found user", existingUser)
                // if no user was found 
                if (!existingUser) {
                    throw new Error('No user found')
                }

                // check to see if password matches
                const passwordMatch = await bcrypt.compare(credentials.password, existingUser.hashedpassword)

                // if password does not match
                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }
                if (!existingUser.emailVerified) {
                    const verificationToken = await generateVerificationToken(existingUser.email) //db new token store
                    console.log("New confirmation link send", verificationToken)
                }
                return existingUser;
            },
        }),

    ],
    events: {

        //only for credentials
        //verifyemail is true
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id, },
                data: { emailVerified: true, emailVerifiedTime: new Date() }
            });
        }

    },



    callbacks: {
        async signIn({ user, account, session }) {
            try {

                console.log("account", account);
                console.log(".................................")
                console.log("user", user);
                console.log(".................................")
                console.log("session", session);
                console.log(".................................")
                // Check if the OAuth account is already linked to an existing user account
                const linkedAccount = await getUserByEmail(user.email)

                console.log(linkedAccount, "linkedAccount");

                if (linkedAccount) {
                    // If the OAuth account is already linked, return the corresponding user
                    return true;
                } else {
                    // If the OAuth account is not linked, create a new user account and link it to the OAuth account
                    await prisma.user.create({
                        data: {
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        }
                    });

                    // Return the newly created user
                    return true;
                }
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async session({ session, token }) {
            console.log({ "Session": session })
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role
            }
            console.log("Session after", session)
            return session;
        },

        async jwt({ token }) {
            console.log("Token", token)
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub)
            console.log("existingUserRole", existingUser)
            if (!existingUser) return token;

            token.role = existingUser.role;
            return token;
        }
    },


    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },


    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }