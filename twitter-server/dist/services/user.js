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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("./jwt"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../lib/db");
class UserService {
    static verifyGoogleAuthToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const googleToken = token;
            const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
            googleOauthURL.searchParams.set('id_token', googleToken);
            const { data } = yield axios_1.default.get(googleOauthURL.toString(), {
                responseType: 'json'
            });
            const existingUser = yield db_1.db.user.findUnique({
                where: {
                    email: data.email
                }
            });
            if (!existingUser) {
                yield db_1.db.user.create({
                    data: {
                        firstName: data.given_name,
                        email: data.email,
                        lastName: data.family_name,
                        profileImageUrl: data.picture,
                    }
                });
            }
            const user = yield db_1.db.user.findUnique({
                where: {
                    email: data.email
                }
            });
            if (!user)
                throw new Error('User not found');
            const userToken = yield jwt_1.default.generateTokenForUser(user);
            return userToken;
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.user.findUnique({
                where: {
                    id
                }
            });
        });
    }
    static followUser(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield db_1.db.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: from,
                        followingId: to
                    }
                }
            });
            if (existingUser)
                return { "data": { "followUser": true } };
            return db_1.db.follows.create({
                data: {
                    follower: {
                        connect: {
                            id: from
                        }
                    },
                    following: {
                        connect: {
                            id: to
                        }
                    }
                }
            });
        });
    }
    static unfollowUser(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield db_1.db.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: from,
                        followingId: to
                    }
                }
            });
            if (!existingUser)
                return { "data": { "unfollowUser": true } };
            return db_1.db.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: from,
                        followingId: to
                    }
                }
            });
        });
    }
}
exports.default = UserService;
