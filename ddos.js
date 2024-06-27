const mineflayer = require('mineflayer');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bots = [];

// Function to generate a random username
const getRandomUsername = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 8; // Length of the random username
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const createBot = (host, port, botNumber) => {
  const username = getRandomUsername();
  const bot = mineflayer.createBot({
    host,
    username,
    port,
  });

  bot.on('error', (err) => {
    console.error(`Bot ${botNumber} encountered an error: ${err.message}`);
    console.log(`Reconnecting bot ${botNumber}...`);
    setTimeout(() => createBot(host, port, botNumber), 5000);
  });

  bot.on('end', () => {
    console.log(`Bot ${botNumber} has been disconnected from the server.`);
    setTimeout(() => createBot(host, port, botNumber), 5000);
  });

  bot.on('login', () => {
    console.log(`Bot ${bot.username} has logged in.`);
  });

  bot.on('spawn', () => {
    console.log(`Bot ${bot.username} has spawned in the world.`);
  });

  bot.on('respawn', () => {
    console.log(`Bot ${bot.username} has respawned.`);
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log(`Bot ${bot.username} was kicked for ${reason} while logged ${loggedIn ? 'in' : 'out'}`);
  });

  bot.on('death', () => {
    console.log(`Bot ${bot.username} died.`);
  });

  bot.on('error', (err) => {
    console.error(`Bot ${bot.username} encountered an error: ${err.message}`);
  });

  bot.on('end', () => {
    console.log(`Bot ${bot.username} has disconnected.`);
    setTimeout(() => createBot(host, port, botNumber), 5000);
  });

  console.log(`Joined Bot ${botNumber}: ${username}`);
  bots.push(bot);

  // Example of handling dimensionData
  bot.on('spawn', () => {
    if (bot.supportFeature('dimensionDataIsACompound') && bot.dimensionData && bot.dimensionData.overworld) {
      console.log('Overworld data:', bot.dimensionData.overworld);
    } else {
      console.warn('Dimension data not available or missing "overworld" property.');
    }
  });

  return bot;
};

rl.question("Enter Host/IP: ", (host) => {
  rl.question("Enter port: ", (port) => {
    rl.question("Enter number of bots: ", (numBots) => {
      port = parseInt(port);
      numBots = parseInt(numBots);

      if (isNaN(port) || isNaN(numBots)) {
        console.error("Invalid input. Please enter a valid port and number of bots.");
        rl.close();
        return;
      }

      let i = 1;
      let intervalId = null;

      rl.on('SIGINT', () => {
        clearInterval(intervalId);
        rl.close();
      });

      intervalId = setInterval(() => {
        const bot = createBot(host, port, i);
        i++;
        if (i > numBots) {
          clearInterval(intervalId);
        }
      }, 1000);

      rl.close();
    });
  });
});
