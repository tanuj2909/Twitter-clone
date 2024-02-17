import axios from "axios";
import { db } from "../../lib/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";

interface GoogleTokenResponse {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string}) => {
        const googleToken = token;
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo')
        googleOauthURL.searchParams.set('id_token', googleToken);

        const {data} = await axios.get<GoogleTokenResponse>(googleOauthURL.toString(), {
            responseType: 'json'
        })

        const existingUser = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        if(!existingUser) {
            await db.user.create({
                data: {
                    firstName: data.given_name,
                    email: data.email,
                    lastName: data.family_name,
                    profileImageUrl: data.picture,
                }
            })
        }

        const user = await db.user.findUnique({
            where: {
                email: data.email
            }
        })

        if(!user) throw new Error('User not found');
        

        const userToken = await JWTService.generateTokenForUser(user);

        return userToken;
    },

    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        const id = ctx.user?.id;
        if (!id) return null;

        const user = await db.user.findUnique({
            where: {
                id
            }
        })

        return user;
    },

    getUserById: async (parent: any, { id }: { id: string }, ctx: GraphqlContext) => {

        const user = await db.user.findUnique({
            where: {
                id
            }
        })

        return user;
    }
}

const extraResolvers = {
    User: {
        tweets: (parent: User) => db.tweet.findMany({
            where: {
                author: {
                    id: parent.id
                }
            }
        })
    }
}

export const resolvers = { queries, extraResolvers };