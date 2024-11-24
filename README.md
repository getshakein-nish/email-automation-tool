# email-automation-tool
This repository hosts a smart email management tool that connects Google and Outlook accounts, processes incoming emails, categorizes them using AI, and sends context-aware responses. Designed for seamless integration, the tool uses OAuth for authentication and ensures a smooth user experience.


## Features

### Connect Email Accounts
Integrates with Google and Outlook email accounts using OAuth 2.0 for secure authentication.

### Read Incoming emails
Automatically reads and processes new emails from connected accounts.

### Email Categorization
Uses AI to classify emails based on their content:
1. Interested
2. Not Interested
3. More Information

### Send Reply
Allows sending reply emails to the user who sent the email to the given account.

### AI-Powered Responses
Suggests appropriate responses based on email content and sends replies to the sender.

# Getting started

## Installation
1. Clone this repository:
```
git clone https://github.com/getshakein-nish/email-automation-tool.git
cd email-automation-tool

```

2. Download required packages:
```
npm install

```

3. Set up OAuth credentials:

For Google: Set up OAuth credentials in Google cloud Console.
For Outlook: Register your app in Azure.


4. Create a .env file in the parent folder and add this:

```
# Gmail API
GOOGLE_CLIENT_ID=<your-gmail-client-id>
GOOGLE_CLIENT_SECRET=<your-gmail-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

*Used Gemini API because OpenAI API requires credit card*
GEMINI_API_KEY= <your-gemini-api-key>


# Outlook API
OUTLOOK_CLIENT_ID=<your-outlook-client-id>
OUTLOOK_CLIENT_SECRET=<your-outlook-client-secret>
OUTLOOK_REDIRECT_URI=http://localhost:3000/auth/outlook/callback

```

5. Run the tool:

```
npm start 
```
