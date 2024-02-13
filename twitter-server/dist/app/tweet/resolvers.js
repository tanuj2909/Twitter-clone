"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../lib/db");
const mutations = {
    createTweet: (parent, { payload }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user)
            throw new Error("You are not authenticated!");
        const tweet = yield db_1.db.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } },
            }
        });
        return tweet;
    })
};
const queries = {
    getAllTweets: () => __awaiter(void 0, void 0, void 0, function* () { return yield db_1.db.tweet.findMany({ orderBy: { createdAt: 'desc' } }); })
};
const extraResolvers = {
    Tweet: {
        author: (parent) => db_1.db.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
    }
};
exports.resolvers = { mutations, extraResolvers, queries };
