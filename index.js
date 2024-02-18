const express = require('express')
const bodyParser = require('body-parser');
const axios = require('axios')
const app = express()
const sendToOpenAI = require('./gpt_openai');
const sendToAura = require('./llm.js')
require("dotenv").config();


const mattermost_server_url = process.env.MM_URL
const login_id = process.env.LOGIN_ID
const password = process.env.PASSWORD
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const axiosSession = axios.create({
    baseURL: mattermost_server_url,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json', 
    }
  });

const apiLogin = async (id,pass)=>{
    const url = "/api/v4/users/login"
    const data = {
        login_id:id,
        password:pass
    }
    const req = await axiosSession.post(url,data)
    const token = req.headers.token
    return token
}

const API = async (id)=>{
   
    const token = await apiLogin(login_id,password)
    const req2 = await axiosSession.post("/api/v4/users/ids",[id], {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    const email = req2.data[0].email
    const username = req2.data[0].username
    return [email,username]
}

const ack = async (uid,cid)=>{
    const token = await apiLogin(login_id,password)
    await axiosSession.post("/api/v4/posts/ephemeral",{"user_id": uid,
    "post": 
    {
        "channel_id": cid,
        "message": "Please wait while we serve your request"
    }}, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
}

app.post('/',async (req,res)=>{
    const uid = req.body.user_id
    const cid = req.body.channel_id
    await ack(uid,cid)
    const query = req.body.text
    const llmQuery =[{ 'role': 'user', 'content': `${query}` }];
    const userInfo = await API(req.body.user_id)
    const userEmail = userInfo[0]
    const username = userInfo[1]
    const openaiResp = await sendToAura(llmQuery)
    console.log(openaiResp)
    res.send({"response_type":"in_channel","text":`@${username}\n>Query: _${query}_\n`+"```"+` ${openaiResp.replace('`','')} `+"```","icon_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3I9IMGV29KRn6ebYl_yuQYom9MNjNDdRiNw&usqp=CAU"})
})

app.listen(5000,()=>{
    console.log("Bot is up")
})