const openAI=require("openai");
require('dotenv').config();

const openAIClient=new openAI.OpenAI({
    apiKey:process.env.OPEN_AI_API_KEY
});

module.exports=openAIClient;
