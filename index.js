require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const { oauth2, client } = require('zoom-bot-sdk')
const oauth2Client = oauth2(process.env.client_id, process.env.client_secret, process.env.redirect_url)

let chatbot = client(process.env.client_id, process.env.verification_token, process.env.bot_jid).commands([{ command: process.env.slash_command, hint: 'Golden State is the best Basketball team', description: 'Vote on a topic right in Zoom Chat' }]).configurate({ help: true, errorHelp: false }).defaultAuth(oauth2Client.connect())

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())

app.get('/authorize', async function (req, res) {
  try {
    await oauth2Client.connectByCode(req.query.code)
    res.send('Thanks for installing the Vote Chatbot for Zoom!')
  } catch (error) { res.send(error) }
})

// does this check verification code on its own?

app.post('/' + process.env.slash_command, async function (req, res) {
  if (req.headers.authorization === process.env.zoom_verification_token) {
    res.status(200)
    res.send()
    let { body, headers } = req
    try {
      await chatbot.handle({ body, headers })
    } catch (error) { console.log(error) }
  } else {
    res.send('Unauthorized request to Vote Chatbot for Zoom.')
  }
})

chatbot.on('commands', async function (event) {
  let connection = oauth2Client.connect()
  let app = chatbot.create({ auth: connection })

  try {
    await app.sendMessage({
      to_jid: event.payload.toJid,
      account_id: event.payload.accountId,
      header: { text: 'Vote bot' },
      body: [
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
      ]
    })
  } catch (error) { console.log(error) }
})

chatbot.on('actions', async function (event) {
  let connection = oauth2Client.connect()
  let app = chatbot.create({ auth: connection })
  try {
    await app.sendMessage({
      to_jid: event.payload.toJid,
      account_id: event.payload.accountId,
      header: { text: 'Vote bot: ' + event.payload.original.body[0].text },
      body: { type: 'message', text: event.payload.userName + ' ' + event.payload.actionItem.text + 'd' }
    })
  } catch (error) { console.log(error) }
})

// other routes required to publish Chatbot to app marketplace

// support page required to publish Chatbot app to marketplace
app.get('/support', (req, res) => {
  res.send('Contact {{ email }} for support.')
})

// privacy page required to publish Chatbot app to marketplace
app.get('/privacy', (req, res) => {
  res.send('The Vote Chatbot for Zoom does not store any user data.')
})

// domain name validation required to publish Chatbot app to marketplace
app.get('/zoomverify/verifyzoom.html', (req, res) => {
  res.send(process.env.zoom_verification_code)
})

// could be your app web homepage with link to install or pictures of how it works
app.get('/', (req, res) => {
  res.send('Welcome to the Vote Chatbot for Zoom!')
})

// uninstall flow, required to publish Chatbot app to marketplace
app.post('/deauthorize', (req, res) => {
  if (req.headers.authorization === process.env.zoom_verification_token) {
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
