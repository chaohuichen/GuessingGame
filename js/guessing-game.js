function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function shuffle(array) {
  let m = array.length,
    t,
    i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

class Game {
  constructor() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.balloonWidth = 180;
    this.balloonHeight = 230;
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  playersGuessSubmission(num) {
    num = Number(num);
    if (typeof num === 'number' && num > 0 && num < 101) {
      this.playersGuess = num;
      this.minAndMax();
      return this.checkGuess();
    } else {
      throw 'That is an invalid guess.';
    }
  }

  checkGuess() {
    let feedbackText = '';
    if (this.playersGuess === this.winningNumber) {
      //disable the input and pass the win value;
      this.disableInput(true, 'win');
      feedbackText = `You Win! &#128526 Let's play again!`;
    } else if (this.pastGuesses.includes(this.playersGuess)) {
      feedbackText = 'You have already guessed that number.';
    } else {
      //push the number into the array
      this.pastGuesses.push(this.playersGuess);
      //update the size every wrong guess
      this.updateBallonSize();
      if (this.pastGuesses.length === 5) {
        this.disableInput(true, 'lose');
        feedbackText = `You Lose! &#128557 The winning number is ${this.winningNumber} ! Let's play again!`;
      } else if (this.difference() < 10) {
        feedbackText = "You're burning up!";
      } else if (this.difference() < 25) {
        feedbackText = "You're lukewarm.";
      } else if (this.difference() < 50) {
        feedbackText = "You're a bit chilly.";
      } else if (this.difference() < 100) {
        feedbackText = "You're ice cold!";
      }

      //display the guesses on the page
      document.getElementById('guessList').innerHTML +=
        '<li class="guesses">' + this.playersGuess + '</li>';
    }

    document.querySelector('#guess-feedback > h4').innerHTML = feedbackText;

    return feedbackText;
  }

  updateBallonSize() {
    let cols = document.getElementsByClassName('balloon');

    for (let i = 0; i < cols.length; i++) {
      cols[i].style.width = `${(this.balloonWidth += 20)}px`;
      cols[i].style.height = `${(this.balloonHeight += 20)}px`;
    }
  }

  disableInput(trueOrFalse, winOrlose) {
    if (trueOrFalse) {
      document.getElementById('userinput').disabled = true;
      document.getElementById('submit').disabled = true;
      document.getElementById('hint').disabled = true;
      document.getElementById('balloonDiv').classList.remove('balloon');
      document
        .getElementById('balloonDiv')
        .removeChild(document.getElementById('userinput'));
      //display the message
      this.addWinOrLoseTag(winOrlose);
    } else {
      document.getElementById('submit').disabled = false;
      document.getElementById('hint').disabled = false;
      document.getElementById('balloonDiv').classList.add('balloon');
      //add the input tag
      document.getElementsByClassName(
        'balloon'
      )[0].style.width = `${(this.balloonWidth = 180)}px`;
      document.getElementsByClassName(
        'balloon'
      )[0].style.height = `${(this.balloonHeight = 230)}px`;
      this.addInputTag();
    }
  }

  provideHint() {
    let hint = [this.winningNumber];
    hint.push(generateWinningNumber());
    hint.push(generateWinningNumber());
    shuffle(hint);
    return hint;
  }

  addInputTag() {
    let p = document.getElementById('balloonDiv');
    let input = document.createElement('input');
    input.id = 'userinput';
    input.title = 'Enter a number';
    input.placeholder = '#';
    input.autofocus = 'autofocus';
    input.maxlength = '3';
    p.appendChild(input);
    console.log(document.getElementById('userinput'));
  }

  addWinOrLoseTag(winOrlose) {
    let p = document.getElementById('balloonDiv');
    let h1 = document.createElement('h1');
    h1.id = 'gameOverTitle';
    if (winOrlose === 'lose') {
      h1.innerHTML = `Booom!  GAME OVER!`;
    } else if (winOrlose === 'win') {
      h1.innerHTML = `Congrat! You have guessed the Right Number!`;
    }
    p.appendChild(h1);
    //document.getElementById('gameOverTitle').classList.add('center');
  }

  minAndMax() {
    let b1 = document.querySelector('#ball1 > h1').innerHTML;
    let b2 = document.querySelector('#ball2 > h1').innerHTML;
    if (
      this.playersGuess > Number(b1) &&
      this.playersGuess < this.winningNumber
    ) {
      document.querySelector('#ball1 > h1').innerHTML = this.playersGuess;
    } else if (
      this.playersGuess < Number(b2) &&
      this.playersGuess > this.winningNumber
    ) {
      document.querySelector('#ball2 > h1').innerHTML = this.playersGuess;
    }
  }
}

function newGame() {
  return new Game();
}

function playGame() {
  let game = newGame();

  //event listener var
  const button = document.getElementById('submit');
  const reset = document.getElementById('reset');
  const hint = document.getElementById('hint');
  const guessFB = document.querySelector('#guess-feedback > h4');
  let hintCount = 0;
  //submit button event
  button.addEventListener('click', () => {
    const inputValue = document.getElementById('userinput').value;
    console.log(inputValue);
    document.getElementById('userinput').value = '';
    try {
      game.playersGuessSubmission(inputValue);
    } catch (error) {
      guessFB.innerHTML = `${error}`;
    }
  });

  //Play again button
  reset.addEventListener('click', () => {
    game = newGame();
    guessFB.innerHTML = 'You have 5 chances';

    //reset the list
    let ul = document.getElementById('guessList');
    while (ul.firstChild) ul.removeChild(ul.firstChild);

    hintCount = 0;

    if (
      //remove the input tag
      document
        .getElementById('balloonDiv')
        .contains(document.getElementById('userinput'))
    ) {
      document
        .getElementById('balloonDiv')
        .removeChild(document.getElementById('userinput'));
    }

    if (
      //remove the h1 message tag
      document
        .getElementById('balloonDiv')
        .contains(document.getElementById('gameOverTitle'))
    ) {
      document
        .getElementById('balloonDiv')
        .removeChild(document.getElementById('gameOverTitle'));
    }

    //reset the side balloon
    document.querySelector('#ball1 > h1').innerHTML = 0;
    document.querySelector('#ball2 > h1').innerHTML = 100;
    game.disableInput(false);
  });

  //hint button
  hint.addEventListener('click', () => {
    if (hintCount < 3) {
      guessFB.innerText = `${game.provideHint()}`;
    } else {
      document.getElementById('hint').disabled = true;
      guessFB.innerHTML = 'Your hints has more than 3 times';
    }
    hintCount++;
  });
}

playGame();
