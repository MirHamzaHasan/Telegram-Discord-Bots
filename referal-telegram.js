const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Telegram Bot token obtained from BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// API endpoint to call when someone joins with a referral code
const referralAPI = 'https://your-referral-api.com/verify-referral';

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Event handler when someone joins the group
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const user = msg.new_chat_member;

  // Check if the user joined via an invite link with a referral parameter
  if (user && user.username && user.username !== bot.me.username && msg.hasOwnProperty('text')) {
    const referralCode = extractReferralCode(msg.text);

    if (referralCode) {
      // Call the referral API with the referral code
      axios.post(referralAPI, { referralCode })
        .then((response) => {
          // Handle the API response if needed
          console.log(response.data);
        })
        .catch((error) => {
          // Handle API call errors
          console.error('Referral API error:', error);
        });
    }
  }
});

// Extract referral code from the join message
function extractReferralCode(messageText) {
  const regex = /referral=([\w-]+)/;
  const match = regex.exec(messageText);
  return match ? match[1] : null;
}

// Start the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bot started!');
});
