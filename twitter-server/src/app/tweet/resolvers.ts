import { Tweet } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import { db } from "../../lib/db";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import UserService from "../../services/user";
import TweetService from "../../services/tweet";
import { redisClient } from "../../lib/redis";


interface CreateTweetPayload {
    content: string
    imageURL?: string
    userId: string
}

const s3Client = new S3Client({ 
    region: process.env.AWS_DEFAULT_REGION,
}); 

const mutations = {
    createTweet: async (parent: any, {payload}:{payload: CreateTweetPayload}, ctx: GraphqlContext ) => {
        if(!ctx.user) throw new Error("You are not authenticated!")
        const tweet = await TweetService.createTweet({ 
            ...payload,
            userId: ctx.user.id
        })

        await redisClient.del(`ALL_TWEETS`);

        return tweet;
    }
}

const queries = {
    getAllTweets: async () => {
        const cashedTweets = await redisClient.get(``);

        if(!cashedTweets) {
            const tweets = await TweetService.getAllTweets();
            await redisClient.set(`ALL_TWEETS`, JSON.stringify(tweets));
            return tweets;
        }

        return JSON.parse(cashedTweets);
    },

    getSignedUrlForTweet: async (parent: any, { imageType, imageName } : {imageType: string, imageName: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error("Authentication Required!");

        const allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if(!allowedImageTypes.includes(imageType)) throw new Error("Unsupported Image Type!");

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now().toString()}.${imageType}`,
        });

        const signedUrl = await getSignedUrl(s3Client, putObjectCommand);

        return signedUrl;
    }
}

const extraResolvers = {
    Tweet: {
        author: (parent: Tweet) => UserService.getUserById(parent.authorId),
    }
}

export const resolvers = { mutations, extraResolvers, queries }