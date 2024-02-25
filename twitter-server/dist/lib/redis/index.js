"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redisClient = new ioredis_1.default(`redis://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${process.env.UPSTASH_REDIS_REST_URL}.upstash.io:34287`);
