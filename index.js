const token = process.env.DISCORD_TOKEN;
const Discord = require('discord.js');
const Bracket = require('./bracket.js');

const client = new Discord.Client();

const texMexBracket = new Bracket(['tim', 'ryan', 'jonathan'], client, 'test');

client.on('message', msg => {
  const viewStandings = () => {
    const embed = new Discord.RichEmbed()
      .setTitle(`Current Standings for Round ${texMexBracket.currentRoundIdx + 1}`)
      .setColor(0xFF0000)
      .setDescription(texMexBracket.displayBracketText());
    msg.channel.send(embed);
  };

  if (msg.content === '!start') {
    texMexBracket.initBracket();

    console.log(texMexBracket.startingPlayers.length);
    console.log(texMexBracket.startingPlayers);

    const embed = new Discord.RichEmbed()
      .setTitle('The match has now started!')
      .setColor(0xFF0000)
      .setDescription(texMexBracket.displayBracketText());
    msg.channel.send(embed);
  }

  if (msg.content.includes('!winner')) {
    console.log(msg.content);
    const [blank, winner] = msg.content.split(' ');

    texMexBracket.declareWinner(winner);
    if (!texMexBracket.isFinished) {
      viewStandings();
    }
  }

  if (msg.content === '!join') {
    texMexBracket.joinBracket(`<@${msg.author.id}>`);
  }

  if (msg.content === '!standings') {
    viewStandings();
  }

  // if (msg.content === '!join') {
  //   users.push(msg.author);
  //   if (users.length === 8) {
  //     const embed = new Discord.RichEmbed()
  //       .setTitle('Bracket - Let\'s do this')
  //       .setColor(333)
  //       .setDescription(formatBracket(users));
  //     msg.channel.send(embed);
  //   }
  // }

});

client.on('ready', () => {
  console.log('Your bot is now connected');
});

client.login(token);
