const { OpenAI } = require('openai');
require("dotenv").config();

async function send_to_openai(message, user) {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API, defaultHeaders: {
            "x-knostic-user-id": user,
            "x-knostic-api-key":process.env.KNOSTIC_API,
        }
    });
    try{
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: message,
            temperature: 0.7

        });
        console.log("Status Code received: ",response.status,"\nBody of response:\n",response,"\n END of Response Body")
        const responseText = response.choices[0]['message']['content'];
        return responseText;
    }
    catch(e){
        console.log(e)
       return "ERROR"
    }

    
}

module.exports = send_to_openai;