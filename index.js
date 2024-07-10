require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient");
const { download } = require("./utilities");
const { OpenAI } = require("openai");
const CronJob = require("cron").CronJob;
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const topics = [
    "Cats",
    "The beauty of cats",
    "Tech innovations for cats",
    "Art in the modern world of cats",
    "Cats are the best pets",
    "Cats are the best pets",
    "Cats are the best pets",
    "Cats are the best pets",
    "Cats are the best pets",
    "Cats are the best pets",
    "Cats are the best pets",
    "Cats are the best pets",
];

const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": "DEMO-API-KEY"
});

const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
};

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const tweet = async () => {
    const path = "image.jpg";
    let url = "";

    fetch("https://api.thecatapi.com/v1/images/search?mime_types=jpg", requestOptions)
    .then(response => response.json())
    .then(result => url = result[0].url)
    .catch(error => console.log('error', error));

    const topicIndex = Math.floor(Math.random() * topics.length);
    const topic = topics[topicIndex];

    try {
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: `You are a friendly Twitter bot that tweets about ${topic}.`
            },{
                role: "user",
                content: `Generate a creative tweet about ${topic}.`
            }],
            max_tokens: 60,
            temperature: 0.7,
        });

        const tweetText = gptResponse.choices[0].message.content;

        text = tweetText.substring(1, tweetText.length - 1);
        
        download(url, path, async function() {
            try {
                const mediaId = await twitterClient.v1.uploadMedia("./image.jpg");
                await twitterClient.v2.tweet({
                    text: text,
                    media: {
                        media_ids: [mediaId]
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });

        console.log("Tweeted:", text)
    } catch (e) {
        console.log("Error generating tweet text", e);
    }
};

const cronTweet = new CronJob("0 0 15 * * *", async () => {
    tweet();
});

cronTweet.start();