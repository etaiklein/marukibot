/*** SCRIPTING ***/
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv/config");
const cron = require("cron");

/*** SETUP ***/
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

/*** ACTIONS ***/
const sendTuesday = (channel) => {
  channel.send({
    files: [{ attachment: "tuesday.jpg" }],
  });
};
const sendWednesday = (message) => {
  message.reply("Happy ShibusaWednesday!");
};

/*** BUSINESS ***/

/* Id: A singleton representing the channel id
 * ""    | Uninitialized
 * null  | Deregistered
 * "123" | Registered to channel "123"
 */

let id = "1121132183525007391"; // Default to shitpost channel

/*** MARCO POLO ***/
client.on("messageCreate", (message) => {
  if (
    ["!Marco", "!marco", "!Marko", "!marko", "!hello", "!Hello"].includes(
      message.content
    )
  ) {
    message.reply("Polo!");
  }

  /* Tuesday
   *  Subscribe the bot to a channel by saying !tuesday in the channel.
   *  The bot will respond with tuesday.jpg
   */
  if (
    ["!Tuesday", "!tuesday", "!Subcribe", "!subscribe"].includes(
      message.content
    )
  ) {
    sendTuesday(message.channel);
    id = message.channelId;
    console.log(`Subscribed to ${id}`);
  }

  /* Wednesday
   *  Subscribe the bot to a channel by saying !wednesday in the channel.
   *  The bot will respond with Happy ShibusaWednesday
   */
  if (["!Wednesday", "!wednesday"].includes(message.content)) {
    sendWednesday(message);
  }

  /* Unsubscribe
   *  You can unsubscribe from the concept of Tuesdays
   */
  if (
    ["!Delete", "!delete", "!unsubscribe", "!Unsubscribe"].includes(
      message.content
    )
  ) {
    console.log(`Unsubscribed from ${id}`);
    id = null;
  }
});

/*** SCHEDULE ***/
client.once("ready", () => {
  console.log(`Online as ${client.user.tag}`);

  // An 'every minute' schedule for testing purposes.
  // const schedule = "* * * * *";

  /* This runs every 2sday at 9 hours and 0 minutes
   * See https://crontab.guru/#0_9_*_*_2
   */
  const schedule = "0 9 * * 2";

  /* Scheduled Activities
   *   Following the schedule above, (every tuesday)
   *   Send tuesday.jpg to channel at registered ID
   *   Else, run kitten.exe
   */
  let scheduledMessage = new cron.CronJob(schedule, () => {
    if (id) {
      // get channel by id
      const channel = client.channels.cache.get(id);
      // send message
      sendTuesday(channel);
    }

    if (!id) {
      // kitten.exe
      console.log("Hang in there, baby!");
    }
  });

  scheduledMessage.start();
});

client.login(process.env.TOKEN);
