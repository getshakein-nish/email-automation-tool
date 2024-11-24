import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function classifyEmailContent(emailData) {
  const prompt = `
  I am receiving an email with the following details:

  Subject: ${emailData.subject}
  From: ${emailData.sender}
  Body: ${emailData.body}

  Based on the content, classify the email into one of these categories:
  a) Interested
  b) Not Interested
  c) More Information

  Output only the category (one of: Interested, NotInterested, MoreInformation).
  `;

  try {
    const response = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await response.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing email content:", error);
    return "Unable to analyze email content at this time.";
  }
}

export async function generateReplyToEmail(emailData) {
  const prompt = `
    I am receiving an email with the following details:
  
    Subject: ${emailData.subject}
    From: ${emailData.from}
    Body: ${emailData.body}
  
    Based on the email content, generate a polite and relevant reply, do not include anything to that requires my input. Please make sure to respond according to the context and tone of the original email. Max 100 words. 
    Reply:
    `;

  try {
    const response = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await response.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing email content:", error);
    return "Unable to analyze email content at this time.";
  }
}