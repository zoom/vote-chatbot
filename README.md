# Vote Chatbot for Zoom

This is a sample Chatbot app using the [Zoom Chatbot NPM Package](https://www.npmjs.com/package/@zoomus/chatbot).

## Install and Run Locally

`$ git clone https://github.com/zoom/vote-chatbot.git`

`$ cd vote-chatbot`

`$ npm install`

`$ touch .env`

Add this code to your `.env` file, replacing the `Required` text with your respective **Development** Zoom Chatbot API credentials.

```
client_id=Required
client_secret=Required
redirect_url=Required
verification_token=Required
bot_jid=Required
slash_command=Required
verification_code=Optional
```

`$ npm run start` or `$ nodemon` ([for live reload / file change detection](https://www.npmjs.com/package/nodemon))

`$ ngrok http 4000` ([ngrok turns localhost into live server](https://ngrok.com/) so slash commands and user actions can be sent to your app)

Open your ngrok https url in a browser, you should see this,

`Welcome to the Vote Chatbot for Zoom!`

On your App Marketplace Dashboard, add your ngrok https url to your Whitelist URLs (App Credentials Page), **Development** Redirect URL for OAuth (App Credentials Page), and **Development** Bot Endpoint URL (Features Page). Make sure to match the path after your ngrok https url with the express routes in index.js.

> In order to click the **Save** button on the Features page when adding a Slash Command and Development Bot Endpoint URL, you have to provide a Production Bot Endpoint URL. Feel free to use https://zoom.us as a placeholder.

Double check your `.env` file is complete (don't forget the redirect_url).

> Nodemon does not watch changes in `.env` file so restart your nodemon server (NOT ngrok). CTRL C then `$ nodemon`

After that, your app is ready to be installed!

On your App Marketplace Dashboard, go to the **Local Test** page and click **Install**. After you click the **Authorize** button, you should be taken to your redirect url and see this,

`Thanks for installing the Vote Chatbot for Zoom!`


Now that your Chatbot is installed on your Zoom account, go to a Zoom Chat channel and type,

`/vote Tacos for lunch?`

## Deploy to Production

In this example we will deploy our Chatbot to a [Heroku](https://devcenter.heroku.com/articles/heroku-cli) Node.js Server.

`$ heroku create`

`$ git add -A`

`$ git commit -m "deploying to heroku"`

`$ git push heroku master`

After heroku completes the app upload process open your app,

`$ heroku open`

In your browser you should see,

`Welcome to the Vote Chatbot for Zoom!`

Now go to your [Heroku App Dashboard](https://dashboard.heroku.com/apps), click on the **Settings** tab, and to add your **Production** Zoom API Credentials to the **Config Vars** section.

Then on your Zoom App Dashboard, go to the **Submit** page and click the **Add to Zoom** button to install the Production version of your app to your Zoom Account.

Now that your Chatbot is installed on your Zoom account, go to a Zoom Chat channel and type,

`/vote Tacos for lunch?`

## Need Support?
The first place to look for help is on our [Developer Forum](https://devforum.zoom.us/), where Zoom Marketplace Developers can ask questions for public answers.

If you can’t find the answer in the Developer Forum or your request requires sensitive information to be relayed, please email us at developersupport@zoom.us.
