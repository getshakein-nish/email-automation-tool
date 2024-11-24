const msal = require('@azure/msal-node');
require('dotenv').config();

const msalConfig = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  },
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

function getOutlookAuthURL() {
  return pca.getAuthCodeUrl({
    scopes: ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send'],
    redirectUri: process.env.OUTLOOK_REDIRECT_URI,
  });
}

async function getOutlookTokens(code) {
  const response = await pca.acquireTokenByCode({
    code,
    scopes: ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send'],
    redirectUri: process.env.OUTLOOK_REDIRECT_URI,
  });
  return response;
}

module.exports = { getOutlookAuthURL, getOutlookTokens };
