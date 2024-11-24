import express from "express";
import { getGoogleAuthURL, getGoogleTokens } from "./gmailAuth.js";
import { classifyEmailContent, generateReplyToEmail } from "./emailProcessor.js";
import { fetchEmails, sendEmailReply, assignLabelToGmailEmail } from "./gmailHelpers.js";

const app = express();

const PORT = 3000;
let currentTime = Math.floor(Date.now() / 1000);

app.get('/auth/google', (req, res) => {
  const url = getGoogleAuthURL();
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code parameter');
  try {
    const tokens = await getGoogleTokens(code);
    res.json(tokens);
    setInterval(emailAutomation, 0.25 * 60 * 1000);
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).send('Google Authentication Failed');
  }
});

async function emailAutomation() {
  try {
    const email = await fetchEmails(currentTime);
    if (!email) return;

    const label = (await classifyEmailContent(email)).trim();
    await assignLabelToGmailEmail(email, label);

    const reply = await generateReplyToEmail(email);
    await sendEmailReply(email, reply);

    currentTime = Math.floor(Date.now() / 1000);
  } catch (err) {
    console.log("error in mail automation");
  }
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
