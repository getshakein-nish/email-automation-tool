import { gmail } from './gmailAuth.js';

export async function fetchEmails(currentTime) {
    try {
        //console.log("fetching email")
        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults: 1,
            q: `after:${currentTime} is:unread`,
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            console.log('No emails found.');
            return null;
        }

        const message = res.data.messages[0];
        const email = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
        });

        const payload = email.data.payload;
        const headers = payload.headers;

        const sender = headers.find(header => header.name === 'From')?.value || 'Unknown sender';
        const subject = headers.find(header => header.name === 'Subject')?.value || 'No subject';

        const decodeBase64 = data => Buffer.from(data, 'base64').toString('utf-8');
        let body = 'No content';

        if (payload.body?.data) {
            body = decodeBase64(payload.body.data);
        } else if (payload.parts && payload.parts.length > 0) {
            const part = payload.parts.find(p => p.mimeType === 'text/plain');
            if (part?.body?.data) {
                body = decodeBase64(part.body.data);
            } else {
                const htmlPart = payload.parts.find(p => p.mimeType === 'text/html');
                if (htmlPart?.body?.data) {
                    body = decodeBase64(htmlPart.body.data);
                }
            }
        }

        if (!body || body.trim() === '') {
            body = 'No content found.';
        }

        return {
            id: email.data.id,
            sender,
            subject,
            body,
            labels: email.data.labelIds || [],
        };
    } catch (error) {
        console.error('Error fetching email:', error.message);
        return null;
    }
}

export async function assignLabelToGmailEmail(emailData, label) {
    const labelIds = await setupLabels();
    const labelToAdd = labelIds[label];

    try {
        await gmail.users.messages.modify({
            userId: 'me',
            id: emailData.id,
            resource: {
                addLabelIds: [labelToAdd],
            },
        });
        console.log(`Label '${label}' applied to email.`);
    } catch (error) {
        console.error('Error assigning label to Gmail email:', error);
    }
}

export async function sendEmailReply(emailData, reply) {
    const message = createRawMessage(emailData.sender, reply, emailData.subject);
    try {
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: message,
            },
        });

        console.log('Reply sent successfully');
    } catch (error) {
        console.error('Error sending reply:', error);
    }
}

function createRawMessage(to, reply, subject) {
    const messageParts = [
        `From: "me" <me@gmail.com>`,
        `To: ${to}`,
        `Subject: Re: ${subject}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: base64',
        '',
        reply,
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message).toString('base64');
    return encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const setupLabels = async () => {
    const labelIds = {
        Interested: await ensureLabelExists('Interested'),
        NotInterested: await ensureLabelExists('Not Interested'),
        MoreInformation: await ensureLabelExists('More Information'),
    };

    return labelIds;
};

const listLabels = async () => {
    try {
        const res = await gmail.users.labels.list({
            userId: 'me',
        });
        return res.data.labels || [];
    } catch (error) {
        console.error('Error fetching labels:', error);
        return [];
    }
};

const createLabel = async (labelName) => {
    try {
        const label = {
            name: labelName,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
        };

        const res = await gmail.users.labels.create({
            userId: 'me',
            requestBody: label,
        });
        return res.data.id;
    } catch (error) {
        console.error(`Error creating label '${labelName}':`, error);
        return null;
    }
};

const ensureLabelExists = async (labelName) => {
    const existingLabels = await listLabels();
    const existingLabel = existingLabels.find((label) => label.name === labelName);

    if (existingLabel) return existingLabel.id;
    return await createLabel(labelName);
};
