const axios = require('axios');

async function sendNotificationToChat(downDomains) {
    if (!Array.isArray(downDomains)) {
        console.error('Expected downDomains to be an array');
        return;
    }

    const webhookUrl = process.env.GCHAT_WEBHOOK_URL;

    const cardMessage = {
        cards: [
            {
                header: {
                    title: "Domain Downtime Alert",
                    subtitle: downDomains.length === 1
                        ? "1 domain is down"
                        : `${downDomains.length} domains are down`,
                    imageUrl: "https://www.freeiconspng.com/uploads/alert-icon--free-icons-24.png", // Optional
                },
                sections: [
                    {
                        widgets: downDomains.map(domain => ({
                            textParagraph: {
                                text: `<b>${domain}</b> is currently <font color="#FF0000">down</font>.`
                            }
                        }))
                    }
                ]
            }
        ]
    };

    // console.log('Card message:', cardMessage);

    try {
        await axios.post(webhookUrl, cardMessage);
        console.log('Card notification sent for downed domains:', downDomains);
    } catch (error) {
        console.error('Failed to send card notification', error.message);
    }
}

module.exports = { sendNotificationToChat };