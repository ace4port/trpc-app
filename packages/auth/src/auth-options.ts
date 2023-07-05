import { type DefaultSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from 'db'
import bcrypt from 'bcryptjs'
/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string
        } & DefaultSession['user']
    }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
    secret: 'supersecret',
    pages: {
        signIn: '/login',
        newUser: '/register',
    },
    callbacks: {
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
                session.user.image = token.picture
            }
            return session
        },
        jwt: ({ token, user }) => {
            if (user) {
                token.picture = user.image
            }
            return token
        },
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            // TODO: Handle user registration, admin, pw reset, etc.
            // TODO: Handle bcrypt install
            async authorize(credentials) {
                const { register } = credentials as { register: boolean }
                if (register) {
                    const { name, email, password } = credentials as {
                        name: string
                        email: string
                        password: string
                    }

                    const pw = (await bcrypt.hash(password, 10)) as string

                    const user = await prisma.user.create({
                        data: { name: name, email: email, password: pw },
                        select: { email: true, id: true, name: true, image: true },
                    })

                    return { id: user.id, name: user.name, email: user.email, image: user.image }
                }
                const { email, password } = credentials as { email: string; password: string }
                const user = await prisma.user.findUnique({ where: { email: email } })
                if (!user) throw new Error('No user found')

                const passwordMatch = await bcrypt.compare(password, user.password)
                if (!passwordMatch) throw new Error('Invalid password or email')

                return { id: user.id, name: user.name, email: user.email, image: user.image }
            },
        }),
    ],
}
