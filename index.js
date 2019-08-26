require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const { oauth2, client } = require('@zoomus/chatbot')
const oauth2Client = oauth2(process.env.client_id, process.env.client_secret)

// sets up chatbot object and adds a help message when user tyoes "/vote help"
let chatbot = client(process.env.client_id, process.env.verification_token, process.env.bot_jid).commands([{ command: '/' + process.env.slash_command, hint: 'Tacos for Lunch?', description: 'Vote on topics in Zoom Chat' }]).configurate({ help: true, errorHelp: false }).defaultAuth(oauth2Client.connect())

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

// recieves redirect url
app.get('/authorize', async function (req, res) {
  res.send('Thanks for installing the Vote Chatbot for Zoom!')
})

// recieves slash commands and user actions
app.post('/' + process.env.slash_command, async function (req, res) {
  let { body, headers } = req
  try {
    // calls chatbot.on() function below based on what is sent (commands or actions)
    await chatbot.handle({ body, headers })
    res.status(200)
    res.send()
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

// handles slash commands
chatbot.on('commands', async function (event) {
  // handles auth
  let connection = oauth2Client.connect()
  let app = chatbot.create({ auth: connection })

  try {

    // your app logic here, I am sending a chatbot message with buttons
    await app.sendMessage({
      to_jid: event.payload.toJid,
      account_id: event.payload.accountId,
      header: { text: 'Vote bot' },
      body: [
        {
          type: 'section',
          sections: [
            {
              type: 'message',
              text: '"' + event.message + '"'
            },
            {
              type: 'actions',
              items: [{
                'text': 'Up Vote',
                'value': 'up-vote',
                'style': 'Primary'
              },
              {
                'text': 'Down Vote',
                'value': 'down-vote',
                'style': 'Danger'
              }]
            }
          ],
          footer: 'Vote by ' + event.payload.userName
        }
      ]
    })
  } catch (error) { console.log(error) }
})

// handles user actions on chatbot messages like editing text and form fields, clicking buttons, and choosing dropdown options,
chatbot.on('actions', async function (event) {
  // handles auth
  let connection = oauth2Client.connect()
  let app = chatbot.create({ auth: connection })
  try {

    // your app logic here, I am sending a chatbot message with users action from button
    await app.sendMessage({
      to_jid: event.payload.toJid,
      account_id: event.payload.accountId,
      header: { text: 'Vote bot: ' + event.payload.original.body[0].sections[0].text },
      body: { type: 'message', text: event.payload.userName + ' ' + event.payload.actionItem.text + 'd' }
    })
  } catch (error) { console.log(error) }
})

// ------------------ Other routes required to publish Chatbot to Zoom App Marketplace (not required if private (your Zoom account only) app) ------------------

// required, support page
app.get('/support', (req, res) => {
  res.send('Contact {{ email }} for support.')
})

// required, privacy page
app.get('/privacy', (req, res) => {
  res.send('The Vote Chatbot for Zoom does not store any user data.')
})

// required, domain name validation
app.get('/zoomverify/verifyzoom.html', (req, res) => {
  res.send(process.env.zoom_verification_code)
})

// optional, could be your app web homepage with link to install or pictures of how it works
app.get('/', (req, res) => {
  res.send('Welcome to the Vote Chatbot for Zoom!')
})

// required, uninstall flow
app.post('/deauthorize', (req, res) => {
  if (req.headers.authorization === process.env.verification_token) {
    res.status(200)
    res.send()
    request({
      url: 'https://api.zoom.us/oauth/data/compliance',
      method: 'POST',
      json: true,
      body: {
        'client_id': req.body.payload.client_id,
        'user_id': req.body.payload.user_id,
        'account_id': req.body.payload.account_id,
        'deauthorization_event_received': req.body.payload,
        'compliance_completed': true
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.zoom_client_id + ':' + process.env.zoom_client_secret).toString('base64'),
        'cache-control': 'no-cache'
      }
    }, (error, httpResponse, body) => {
      if (error) {
        console.log(error)
      } else {
        console.log(body)
      }
    })
  } else {
    res.send('Unauthorized request to Vote Chatbot for Zoom.')
  }
})

app.listen(port, () => console.log(`Vote Chatbot for Zoom listening on port ${port}!`))
