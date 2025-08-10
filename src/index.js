const express = require('express');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf('5969061238:AAFc8CG7Fo8OYOt3qJQzQ9KdJ7HQ5FjpqDQ');
const app = express();
app.use(express.json());

bot.start(async ctx => {
  await ctx.replyWithSticker(
    'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/23.webp'
  );
  await ctx.reply(
    'Welcome to the Simple Game Bot! Type /play to start a game.'
  );
});
bot.command('play', async ctx => {
  await ctx.reply("Let's play a game! Type your guess (1-10):");
  bot.on(message('text'), async ctx => {
    const guess = parseInt(ctx.message.text, 10);
    if (isNaN(guess) || guess < 1 || guess > 10) {
      await ctx.reply('Please enter a valid number between 1 and 10.');
    } else {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      if (guess === randomNumber) {
        await ctx.reply('Congratulations! You guessed the right number!');
      } else {
        await ctx.reply(
          `Sorry, the correct number was ${randomNumber}. Try again!`
        );
      }
    }
  });
});
bot.command('stop', async ctx => {
  await ctx.reply('Game stopped. Type /play to start a new game.');
});

// Start the bot
console.log('Bot is starting...');
bot.catch(err => {
  console.error('Error occurred:', err);
});

app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});
// bot.launch();

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  await bot.telegram.setWebhook('https://yourdomain.com/webhook');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
