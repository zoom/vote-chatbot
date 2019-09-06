# Vote Chatbot for Zoom

This is a sample Chatbot app using the [Zoom Chatbot NPM Package](https://www.npmjs.com/package/@zoomus/chatbot).

![Vote Chatbot for Zoom](https://s3.amazonaws.com/user-content.stoplight.io/19808/1567798340584)

To run the completed Chatbot code locally or deploy it to a live server, continue reading below.

## Local/Development Setup

To run the completed Chatbot locally, follow these steps,

1. In terminal:

   `$ git clone https://github.com/zoom/vote-chatbot.git`

   `$ cd vote-chatbot`

   `$ npm install`

   `$ touch .env`

2. Add this code to your `.env` file, replacing the `Required` text with your respective [**Development** Zoom Chatbot API credentials](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-chatbot-app#register).

   ```
   client_id=Required
   client_secret=Required
   verification_token=Required
   bot_jid=Required
   slash_command=Required
   ```

3. In terminal:

   `$ npm run start` or `$ nodemon` ([for live reload / file change detection](https://www.npmjs.com/package/nodemon))

   `$ ngrok http 4000` ([ngrok turns localhost into live server](https://ngrok.com/) so slash commands and user actions can be sent to your app)

5. Open your ngrok https url in a browser, you should see this,

   `Welcome to the Vote Chatbot for Zoom!`

6. On your App Marketplace Dashboard, add your ngrok https url to your Whitelist URLs (App Credentials Page), **Development** Redirect URL for OAuth (App Credentials Page), and **Development** Bot Endpoint URL (Features Page). Make sure to match the path after your ngrok https url with the express routes in index.js.

   > In order to click the **Save** button on the Features page when adding a Slash Command and Development Bot Endpoint URL, you have to provide a Production Bot Endpoint URL. Feel free to use https://zoom.us as a placeholder.

   After that, your app is ready to be installed!

7. On your App Marketplace Dashboard, go to the **Local Test** page and click **Install**. After you click the **Authorize** button, you should be taken to your redirect url and see this,

   `Thanks for installing the Vote Chatbot for Zoom!`


8. Now that your Chatbot is installed on your Zoom account, go to a Zoom Chat channel and type,

   `/vote Tacos for lunch?`

## Production Setup

To run the completed Chatbot on a live server, follow these steps,

1. Click the **Deploy to Heroku** Button,

   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

2. Fill in your [**Production** Zoom Chatbot API credentials](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-chatbot-app#register) in the **Config Vars** section.

3. Click **Deploy app**.

4. On your App Marketplace Dashboard, add your Heroku url to your Whitelist URLs (App Credentials Page), **Production** Redirect URL for OAuth (App Credentials Page), and **Production** Bot Endpoint URL (Features Page). Make sure to match the path after your Heroku url with the express routes in index.js.

5. On your App Marketplace Dashboard, go to the **Submit** page and click **Add to Zoom**. After you click the **Authorize** button, you should be taken to your redirect url and see this,

   `Thanks for installing the Vote Chatbot for Zoom!`

6. Now that your Chatbot is installed on your Zoom account, go to a Zoom Chat channel and type,

   `/vote Tacos for lunch?`

## Need Support?
The first place to look for help is on our [Developer Forum](https://devforum.zoom.us/), where Zoom Marketplace Developers can ask questions for public answers.

If you can’t find the answer in the Developer Forum or your request requires sensitive information to be relayed, please email us at developersupport@zoom.us.
