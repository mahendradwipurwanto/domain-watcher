const axios = require('axios');
const {sendNotificationToChat} = require('../services/notification');
const redisClient = require('../services/redis');

// function to add domain to the list
async function addDomainToList(domain) {
    try {
        if (typeof domain !== 'string' || domain.trim() === '') {
            throw new TypeError('Invalid domain. It must be a non-empty string.');
        }

        // trim the domain and remove trailing slash if any
        domain = domain.trim().replace(/\/$/, '');

        // add check if had http or https if not add it
        if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
            domain = `https://${domain}`;
        }

        // check if domain already in the list before adding
        const domains = await redisClient.lRange('domain-watcher:domains', 0, -1);
        if (domains.includes(domain)) {
            return {
                status: false,
                message: 'Domain already exists in the list',
            }
        }

        await redisClient.rPush('domain-watcher:domains', domain);
        return {
            status: true,
            message: 'Domain added to the list',
        }
    } catch (err) {
        return {
            status: false,
            message: err.message,
        }
    }
}

async function runDomainCheck() {
    try {
        const domains = await redisClient.lRange('domain-watcher:domains', 0, -1);
        const downDomains = [];

        for (const domain of domains) {
            const status = await checkDomainStatus(domain);
            if (!status.status) {
                downDomains.push(status.message);
            }
        }

        // If there are any downed domains, send a consolidated notification
        if (downDomains.length > 0) {
            await sendNotificationToChat(downDomains);
        } else {
            console.log('All domains are up');
        }
    } catch (err) {
        console.error('Error fetching domains from Redis:', err);
    }
}

async function checkDomainStatus(domain) {
    try {
        await axios.get(domain, {timeout: 5000}); // 5-second timeout
        console.info(`${domain} is up | `, new Date());
        return {
            status: true,
            message: `${domain}`,
        }
    } catch (error) {
        console.info(`${domain} is down | `, new Date());
        await sendNotificationToChat(domain);
        return {
            status: false,
            message: `${domain}`,
        }
    }
}

module.exports = {runDomainCheck, addDomainToList};
