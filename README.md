GitIn takes a Github Organization admin’s personal access token, and saves it to allow authorized users to create Github issues under the admin’s profile name, stamping the issue at the end with the user’s email address for further outreach.

The idea behind gitIn is that in small companies, often project management can exist solely via Github, and non-tech folks would need Github accounts to contribute, or email engineers within the org. Additionally, adding contributors to your Github Organization costs money as well (on a regular plan, after five members, it costs $9/month for each new contributor). gitIn was created to open up the issue creation process so others may contribute.

# What data is being stored and where?
The only data stored is your org’s personal access token, usernames/passwords, and available repositories. All data is stored via a private instance of mongoDB via mLab upon installation. It is your data on your database at all times.

# Installation
If you have an account with Heroku, then simply click this button to deploy your own instance:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/mathesond2/gitIn)

This will begin working within a couple minutes. You may check on the installation progress by viewing the logs at `https://dashboard.heroku.com/apps/YOUR_APPLICATION_NAME/logs` or using the Heroku CLI tool with the `heroku logs -t -a YOUR_APPLICATION_NAME` command.

# Steps
1. Create your own instance of gitIn via Heroku
2. Add a Github Org admin’s personal access token. Your organization admin must generate one if they don’t have one already.
3. Select org repositories
4. Start creating issues!

**Additionally, under /settings you can add other authorized people to your instance of gitIn.**

# Generating a personal access token
1. navigate to https://github.com/settings/profile and select ‘Developer Settings’

![alt text](https://i.imgur.com/69x4Cvn.png "screenshot 1")

2. within https://github.com/settings/developers, select the ‘Personal access tokens’ tab and then select the ‘Generate new token’ button

![alt text](https://i.imgur.com/I1rpNED.png "screenshot 2")

3. write a descriptive name in the “Token description” input field and select both repo and admin:org checkboxes.

![alt text](https://i.imgur.com/XfgIBuq.png "screenshot 3")

4. select the “Generate new token” button

![alt text](https://i.imgur.com/nUkcViu.png "screenshot 4")

5. copy the generated personal access token to use within your gitIn instance

![alt text](https://i.imgur.com/jlGu0vY.png "screenshot 5")

6. once you’ve signed up within your gitIn instance, paste your personal access token

![alt text](https://i.imgur.com/6Jr8TfC.png "screenshot 6")
