import { Tweet } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import { db } from "../../lib/db";

interface CreateTweetPayload {
    content: string
    imageURL?: string
}

const mutations = {
    createTweet: async (parent: any, {payload}:{payload: CreateTweetPayload}, ctx: GraphqlContext ) => {
        if(!ctx.user) throw new Error("You are not authenticated!")
        const tweet = await db.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } },
            }
        }); 

        return tweet;
    }
}

const queries = {
     getAllTweets: async () => await db.tweet.findMany({ orderBy: { createdAt: 'desc' }})
}

const extraResolvers = {
    Tweet: {
        author: (parent: Tweet) => db.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
    }
}

export const resolvers = { mutations, extraResolvers, queries }