require('dotenv').config();

const puppeteer = require('puppeteer');
const player = require('play-sound')(opts = {})
const colors = require('colors');
const twilio = require('twilio');
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const rulesList = require('./rules');

let browser = null;
let page = null;
let cooldown = false;
let tick = 1000;
let sequenceCount = 0;
let maxPerSequence = 100;
let sequenceCooldown = 0 // 600000; // ms
let sequenceResumeAt = null;
let totalCount = 0;

let twilioMessagesSent = {};
let twilioErrorSent = {};

process.stdin.resume();

async function run() {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        "--disable-features=IsolateOrigins,site-per-process",
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--window-size=1400,900',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
        '--lang=en,en-US;q=0,5'
    ];
    const options = {
        args,
        headless: true,
    };
    
    browser = await puppeteer.launch(options);
    page = await browser.newPage();

    // adding image skip rule
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'image') req.abort();
        else req.continue();
    });

    console.clear();
    scanner();
}

async function scanner() {
    const [ specificRuleIndex ] = process.argv.slice(2) || [];

    if (!!specificRuleIndex) {
        await scanRule(rulesList[specificRuleIndex]);
    }
    else {
        let ruleIndex = 0;
        while (true) {
            if (cooldown || sequenceCount >= maxPerSequence) {
                if (!cooldown) {
                    cooldown = true;
                    sequenceResumeAt = new Date().getTime() + sequenceCooldown;
                    console.log('Cooling down...');
                    console.log(`Resuming in ${Math.round((sequenceResumeAt - new Date().getTime()) / 1000 / 60)} minutes`);
                };
                if (sequenceResumeAt && sequenceResumeAt < new Date().getTime()) {
                    cooldown = false;
                    sequenceCount = 0; // resets cooldown
                    console.log('Resuming...\n\n');
                }
                await delay(tick); // for safety
            } else {
                await scanRule(rulesList[ruleIndex]);
                sequenceCount++;
                totalCount++;
                ruleIndex = (ruleIndex + 1) % (rulesList.length);
                await delay((Math.random() * tick * 2) + 0.5); // random tick
            }
        }
    } 
}

async function scanRule(rule) {
    const { name, url, rules } = rule;
    console.log(` ${name} `.inverse);

    // Navigate to url
    page.goto(url, { timeout: 0 });

    // Check function that call rule fct with element
    const check = async (r, i) => {
        const { selector, rule: ruleFct } = r;
        try {
            await page.waitForSelector(selector, { timeout: 60000 });
            return await page.$eval(selector, ruleFct);
        } catch (error) {
            console.log(`Error occured in rule ${i + 1}`, error);

            // Send notification to mobile device
            if (!twilioErrorSent[rule.name]) twilioErrorSent[rule.name] = {};
            if (!twilioErrorSent[rule.name][i]) {
                sendMessage(`ERROR - An error occured in rule #${i + 1} of ${rule.name}. Please verify!\n\n${rule.url}`);
                twilioErrorSent[rule.name][i] = true;
            }
            return false;
        }
    }

    // Adding all rules
    const promises = [];
    rules.forEach((r, i) => {
        promises.push(check(r, i));
    })
    
    // Handling results
    const results = await Promise.all(promises);
    let inStock = true;
    results.forEach(r => {
        if (r === false) inStock = false;
    })

    if (inStock) {
        console.log(`IN STOCK`.green);
        
        // Send notification to mobile device
        if (!twilioMessagesSent[rule.name]) {
            sendMessage(`${rule.name} has PS5 in stock.\n\n${rule.url}`)
            twilioMessagesSent[rule.name] = true;
        }
        notificationSound();

        await delay(10000);
    } else {
        console.log(`Out of Stock`.red);
    }
    console.log('\n');
    return inStock;
}

function sendMessage(message) {
    twilioClient.messages.create({
        to: '+14383420756',
        from: '+16152357080',
        body: message,
    });
    console.log('SMS sent');
}

async function notificationSound() {
    player.play('./notification.mp3');
}

async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

// Exit handlers
function exitHandler(eventType) {
    if (eventType === 'exit') {
        console.log(`\n\n${totalCount} scans`.yellow);
        if (Object.keys(twilioMessagesSent).length > 0) {
            console.log(`Found stock at ${Object.keys(twilioMessagesSent).join(', ')}`.green);
        }
        console.log(`\n`);
    }
    browser.close();
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => process.on(eventType, exitHandler.bind(null, eventType)));

// Initiate sequence
run();