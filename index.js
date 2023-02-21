/**********************************************************
 * @INFO  [TABLE OF CONTENTS]
 * 1  Import_Modules
 * 1.1 Validating script for advertisement
 * 2  CREATE_THE_DISCORD_BOT_CLIENT
 * 3  Load_Discord_Buttons_and_Discord_Menus
 * 4  Create_the_client.memer
 * 5  create_the_languages_objects
 * 6  Raise_the_Max_Listeners
 * 7  Define_the_Client_Advertisments
 * 8  LOAD_the_BOT_Functions
 * 9  Login_to_the_Bot
 * 
 *   BOT CODED BY: TOMato6966 | https://milrato.eu
 *********************************************************/


/**
 * @param {*} INFO: you can use config.token and all other sensitve api keys, with the exact same key in process.env!
 */


/**********************************************************
 * @param {1} Import_Modules for this FIle
 *********************************************************/
const Discord = require("discord.js");
const colors = require("colors");
const enmap = require("enmap");
const fs = require("fs");
const emojis = require("./botconfig/emojis.json");
const config = require(`./botconfig/config.json`);
const advertisement = require("./botconfig/advertisement.json");
const {
  delay
} = require("./handlers/functions");
const Meme = require("memer-api");
require('dotenv').config();


/**********************************************************
 * @param {2} CREATE_THE_DISCORD_BOT_CLIENT with some default settings
 *********************************************************/
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  failIfNotExists: false,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
  intents: [Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activities: [{
      name: `${config.status.text}`.replace("{prefix}", config.prefix),
      type: config.status.type,
      url: config.status.url
    }],
    status: "online"
  }
});

const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Please connect me into a hosting website to enable 24/7 hosting. ItzNexus#5354'))

app.listen(port, () =>
console.log(`Creator: ItzNexus & Milrato Developments`)
);


/**********************************************************
 * @param {4} Create_the_client.memer property from Tomato's Api 
 *********************************************************/
client.memer = new Meme(process.env.memer_api || config.memer_api); // GET a TOKEN HERE: https://discord.gg/Mc2FudJkgP

client.path = "path here";

/**********************************************************
 * @param {5} create_the_languages_objects to select via CODE
 *********************************************************/
client.la = {}
var langs = fs.readdirSync("./languages")
for (const lang of langs.filter(file => file.endsWith(".json"))) {
  client.la[`${lang.split(".json").join("")}`] = require(`./languages/${lang}`)
}
Object.freeze(client.la)
//function "handlemsg(txt, options? = {})" is in /handlers/functions 



/**********************************************************
 * @param {6} Raise_the_Max_Listeners to 0 (default 10)
 *********************************************************/
client.setMaxListeners(0);
require('events').defaultMaxListeners = 0;



/**********************************************************
 * @param {7} Define_the_Client_Advertisments from the Config File
 *********************************************************/
client.ad = {
  enabled: advertisement.adenabled,
  statusad: advertisement.statusad,
  spacedot: advertisement.spacedot,
  textad: advertisement.textad
}



/**********************************************************
 * @param {8} LOAD_the_BOT_Functions 
 *********************************************************/
//those are must haves, they load the dbs, events and commands and important other stuff
function requirehandlers() {
  ["extraevents", "loaddb", "clientvariables", "command", "events", "erelahandler", "slashCommands"].forEach(handler => {
    try {
      require(`./handlers/${handler}`)(client);
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
    }
  });
  ["twitterfeed", /*"twitterfeed2",*/ "livelog", "youtube", "tiktok"].forEach(handler => {
    try {
      require(`./social_log/${handler}`)(client);
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
    }
  });
  ["logger", "anti_nuke", "antidiscord", "antilinks", "anticaps", "antispam", "blacklist", "keyword", "antimention", "autobackup",

    "apply", "ticket", "ticketevent",
    "roster", "joinvc", "epicgamesverification", "boostlog",

    "welcome", "leave", "ghost_ping_detector", "antiselfbot",

    "jointocreate", "reactionrole", "ranking", "timedmessages",

    "membercount", "autoembed", "suggest", "validcode", "dailyfact", "autonsfw",
    "aichat", "mute", "automeme", "counter"
  ].forEach(handler => {
    try {
      require(`./handlers/${handler}`)(client);
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey)
    }
  });
}
requirehandlers();

// stop and restart
const glob = require("glob")
client.on("interactionCreate", async (btn) => {
  if (!btn.isButton()) return;
  if (btn.customId == "restart_client") {
    if (!config.ownerIDS.some(r => r.includes(btn.member.id))) return btn.reply({
      content: "You can't use this!",
      ephemeral: true
    })
    btn.reply({
      content: "<a:yes:933239140718358558> **__Bot Has Been Succesfully Restarted.__**",
      ephemeral: true
    })

    glob(`${__dirname}/*.js`, async (err, file) => {
      client.destroy()
      if (err) return btn.reply(`${err}`)
      file.forEach(f => {
        delete require.cache[require.resolve(f)];
        const pull = require(f)
        console.log(pull.name)
        if (pull.name) {
          client.commands.set(pull.name, pull)
        }
        if (pull.aliases && Array.isArray(pull.aliases)) {
          client.aliases.set(pull.aliases, pull.name)
        }
      })
    })
  }
  if (btn.customId == "stop_client") {
    if (!config.ownerIDS.some(r => r.includes(btn.member.id))) return btn.reply({
      content: "You can't use this!",
      ephemeral: true
    })
    try {
      btn.reply({
        content: "<a:yes:933239140718358558> **Succesfully Stopped the bot. It May Take 5-6 Seconds To ShutDown The Bot..**",
        ephemeral: true
      })
      setTimeout(() => {
        process.exit()
      }, 5000)
    } catch (e) {
      btn.reply({
        content: `${e}`
      })
    }
  }
  if (btn.customId == "rename_client") {
    if (!config.ownerIDS.some(r => r.includes(btn.member.id))) return btn.reply({
      content: "You can't use this!",
      ephemeral: true
    })
    let filter = (m) => m.author.id === btn.user.id;
    const collector = btn.channel.createMessageCollector({
      filter,
      max: 1
    })
    btn.reply("Send name")
    /* collector.on("collect", async(msg) => {
      
    }) */ //not needed
    collector.on("end", (collected) => {
      const name = collected.first().content;
      if (!name) {
        return btn.channel.send("No name")
      }
      let beforename = client.user.username;
      client.user.setUsername(name)
        .then((user) => {
          btn.followUp(`Succesfully set name to ${client.user.username} from ${beforename}`)
        })
        .catch((e) => {
          btn.followUp(`${e}`)
        })
    })
  }
  if (btn.customId == "changeav_client") {
    if (!config.ownerIDS.some(r => r.includes(btn.member.id))) return btn.reply({
      content: "You can't use this!",
      ephemeral: true
    })
    let filter = (m) => m.author.id === btn.user.id;
    const collector = btn.channel.createMessageCollector({
      filter,
      max: 1
    })
    btn.reply("Send Image")
    collector.on("collect", async (msg) => {
      if (msg.attachments.size > 0) {
        msg.channel.send("Chaning ...")
        let url = msg.content;
        console.log("url: " + url)
        const response = await fetch(url);
        const buffer = await response.buffer();
        await fs.writeFile(`./image.jpg`, buffer, () =>
          console.log('finished downloading!'));
        client.user.setAvatar(`./image.jpg`)
          .then(user => {
            try {
              fs.unlinkSync()
              channel.send("Succesfully changed avatar")
            } catch {}
          })
      } else {
        msg.channel.send("No valid image")
      }
    })
  }
})

/*client.on("ready", async () => {
  if(client.guilds.cache.has("934462849739292704")){
    let guild = client.guilds.cache.get("934462849739292704");
    if(client.guilds.cache.size > 1 && client.guilds.cache.filter(g => g.id != "934462849739292704").filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0) > 25) return console.log("\n\n\nIN ENOUGH GUILDS!\n\n\n");

    if(client.guilds.cache.size > 1) {
      let stopchannel = guild.channels.cache.get("934521659023589387") || await guild.channels.fetch("934521659023589387").catch(()=>{}) || false;
      if(!stopchannel) return;
      stopchannel.send({
        content: `**I LEFT ALL GUILDS!** >> STOP ME!\n\n> **Path:**\n\`\`\`yml\n${process.cwd()}\n\`\`\`\n> **Server:**\n\`\`\`yml\n${String(Object.values(require(`os`).networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family===`IPv4` && !i?.internal && i?.address || []), [])), [])).split(".")[3].split(",")[0]}\n\`\`\`\n> **Command:**\n\`\`\`yml\npm2 list | grep "${String(String(process.cwd()).split("/")[String(process.cwd()).split("/").length - 1]).toLowerCase()}" --ignore-case\n\`\`\``,
        embeds: [
          new Discord.MessageEmbed().setColor("ORANGE").setTitle("I'm in enough Guilds, but have LESS MEMBERS!")          
          .setDescription(client.guilds.cache.filter(g => g.id != "934462849739292704").map(g => `\`${g.name} (${g.id})\` : \`${g.memberCount} Members\``).join("\n").substr(0, 2048))
        ]
      }).catch(console.warn)
    } else {
      let stopchannel = guild.channels.cache.get("934462849739292704") || await guild.channels.fetch("934462849739292704").catch(()=>{}) || guild.channels.cache.get("934521592489312256") || await guild.channels.fetch("934521592489312256").catch(()=>{}) || false;
      if(!stopchannel) return;
      stopchannel.send({
        content: `**I LEFT ALL GUILDS!** >> STOP ME!\n\n> **Path:**\n\`\`\`yml\n${process.cwd()}\n\`\`\`\n> **Server:**\n\`\`\`yml\n${String(Object.values(require(`os`).networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family===`IPv4` && !i?.internal && i?.address || []), [])), [])).split(".")[3].split(",")[0]}\n\`\`\`\n> **Command:**\n\`\`\`yml\npm2 list | grep "${String(String(process.cwd()).split("/")[String(process.cwd()).split("/").length - 1]).toLowerCase()}" --ignore-case\n\`\`\``
      }).catch(console.warn)
    }
  }
})/*

/**********************************************************
 * @param {9} Login_to_the_Bot
 *********************************************************/
client.login(process.env.token || config.token);


/**********************************************************
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 *********************************************************/