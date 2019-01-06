class Bracket {
  constructor(players, client, channelName) {
    this.client = client;
    this.channelName = channelName;
    this.startingPlayers = players;
    this.bracket = [];
    this.bracketPlayers = [];
    this.currentRoundIdx = 0;
    this.isStarted = false;
    this.isFinished = false;
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  chunk(arr, chunkSize, cache = []) {
    const tmp = [...arr]
    while (tmp.length) cache.push(tmp.splice(0, chunkSize))
    return cache
  }

  initBracket() {
    // Fills bracketPlayers with bye rounds and shuffles the bracket
    this.totalRounds = Math.ceil(Math.sqrt(this.startingPlayers.length));
    this.totalPlayers = Math.pow(2, this.totalRounds);
    const totalBye = this.totalPlayers - this.startingPlayers.length;
    console.log(totalBye, this.totalPlayers, this.startingPlayers.length);
    if (totalBye !== 0) {
      const byePlayers = Array(totalBye).fill('BYE');
      this.bracketPlayers = this.shuffle([...byePlayers, ...this.startingPlayers]);
    } else {
      this.bracketPlayers = this.shuffle(this.startingPlayers);
    }

    // Initialize round 1
    this.bracket = [
      this.chunk(this.bracketPlayers, 2).map((opponents) => this.createMatch(opponents)),
    ];

    console.log('Round 1 has officially started!');

    this.isStarted = true;
  }

  declareWinner(player = '') {
    if (!player) {
      console.log('Invalid player');
    }
    if (player !== 'BYE') {
      this.bracket[this.currentRoundIdx].forEach((round) => {
          if (round.player1.name === player) {
            if (round.completed) {
              this.client.channels.find(x => x.name === this.channelName).send('Winner already declared for the current round');
            } else {
              round.player1.winner = true;
              round.completed = true;
            }
          }

          if (round.player2.name === player) {
            if (round.completed) {
              console.log('Winner already declared for the current round');
            } else {
              round.player2.winner = true;
              round.completed = true;
            }
          }
      });
    }

    // If everyone has competed start next round
    const isCompleted = this.checkRoundEnd();

    if (isCompleted && this.bracket[this.currentRoundIdx].length === 1) {
      this.isFinished = true;
      this.client.channels.find(x => x.name === this.channelName).send(`Congrats to our winner ${player} 🥇🥇🥇!!!`);
    }

    if (isCompleted) {

      const winners = this.pluckWinners();

      this.bracket.push(this.chunk(winners, 2).map((opponents) => this.createMatch(opponents)));

      ++this.currentRoundIdx;

      console.log(`Round ${this.currentRoundIdx + 1} has started!`);
    }
  }

  pluckWinners() {
    const winners = [];

    this.bracket[this.currentRoundIdx].forEach(({ player1, player2 }) => {
      if (player1.winner) {
        winners.push(player1.name)
      }

      if (player2.winner) {
        winners.push(player2.name);
      }
    });

    return winners;
  }

  // Validate that a user can only join once
  joinBracket(player) {
    if (!this.isStarted) {
      this.startingPlayers.push(player);
    } else {
      this.client.channels.find(x => x.name === this.channelName).send('You cannot join. Match has already started');
    }
  }

  checkRoundEnd() {
    let isCompleted = true;
    this.bracket[this.currentRoundIdx].forEach(({ completed }) => {
      if (!completed) {
        isCompleted = false;
      }
    });

    return isCompleted;
  }

  displayBracketText() {
    let bracketText = '';

    this.bracket[this.currentRoundIdx].forEach(({ completed, player1, player2 }) => {
      if (!completed) {
        bracketText += `Status: In Progress - (${player1.name} VS ${player2.name} ) \n`;
      } else {
        bracketText += `Status: Completed - (${player1.name}-${player1.winner ? 'WINNER' : 'LOSER'}) - (${player2.name}-${player2.winner ? 'WINNER' : 'LOSER'}) \n`;
      }
    });

    return bracketText;
  }

  createMatch(opponents) {
    const byeIndex = opponents.indexOf('BYE');
    const hasBye = byeIndex !== -1;

    return {
      player1: { name: opponents[0], winner: hasBye && byeIndex !== 0 ? true : false },
      player2: { name: opponents[1], winner: hasBye && byeIndex !== 1 ? true : false },
      completed: hasBye ? true : false,
    };
  }
}

module.exports = Bracket;
