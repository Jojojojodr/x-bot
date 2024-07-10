const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: process.env.TWIT_API_KEY,
    appSecret: process.env.TWIT_API_KEY_SECRET,
    accessToken: process.env.TWIT_ACCESS_TOKEN,
    accessSecret: process.env.TWIT_ACCESS_TOKEN_SECRET
});

const bearer = new TwitterApi(process.env.TWIT_BEARER_TOKEN);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

module.exports = { twitterClient, twitterBearer };