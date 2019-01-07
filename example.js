const token = process.env.DISCORD_TOKEN;
const Discord = require('discord.js');

const client = new Discord.Client();


// Mac : Install HomeBrew -> `brew install ffmpeg`
// Windows : http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/
// npm packages required -> node-opus and opusscript

client.on('message', msg => {
  if (msg.content === '!test') {
    msg.channel.send('https://www.youtube.com/c/devcoffee');
    const embed = new Discord.RichEmbed()
      // .setTitle('This is the title').
      // .setDescription('This is the description field')
      // .addField('Field Name1', 'Field Value1', true)
      // .addField('Field Name2', 'Field Value2', true)
      // .addField('Field Name3', 'Field Value3', false)
      .setAuthor('Tim Shenk', 'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.0-1/p160x160/11226559_10153351803422980_5095261185894120077_n.jpg?_nc_cat=109&_nc_ht=scontent-dfw5-1.xx&oh=2368eb2c0f78f1df41962741df62e0a7&oe=5CD94B38')
      .setColor('#f50057')
    msg.channel.send(embed);
  }

  if (msg.content === "!talk") {
          var VC = msg.member.voiceChannel;
          if (!VC)
              return msg.reply("MESSAGE IF NOT IN A VOICE CHANNEL")
      VC.join()
          .then(connection => {
              const dispatcher = connection.playFile('./test-audio.mp3');
              dispatcher.on("end", end => {VC.leave()});
          })
          .catch(console.error);
  }

});


client.on('ready', () => {
  console.log('Your bot is now connected');

  // Send message in specific channel
  client.channels.find(x => x.name === 'test').send('Saying hi in #test');
});

client.login(token);
