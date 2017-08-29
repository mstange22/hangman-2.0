/*
 * Hangman!
 * Michael Stange
 * UCSD Coding Boot Camp - Assignment #3
 */

var wins = 0;
var losses = 0;
var guesses = 6;                
var guessedLetters = [];
var guessesString = "";
var emptyWord = [];
var userWord = [];
var wordCount = 0;
var maxWords = 50;

var letters = [ "a", "b", "c", "d", "e", "f", "g",
                "h", "i", "j", "k", "l", "m", "n",
                "o", "p", "q", "r", "s", "t", "u",
                "v", "w", "x", "y", "z" ];

var states = [   "alabama", "alaska", "arizona", "arkansas", "california",
                "colorado", "connecticut", "delaware", "florida", "georgia",
                "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas",
                "kentucky", "louisiana", "maine", "maryland", "massachusetts",
                "michigan", "minnesota", "mississippi", "missouri", "montana",
                "nebraska", "nevada", "new hampshire", "new jersey",
                "new mexico", "new york", "north carolina", "north dakota", 
                "ohio", "oklahoma", "oregon", "pennsylvania", "rhode island",
                "south carolina", "south dakota", "tennessee", "texas", "utah",
                "vermont", "virginia", "washington", "west virginia",
                "wisconsin", "wyoming"   ];

var capitals = [ "montgomery", "juneau", "phoenix", "little rock", "sacramento",
                "denver", "hartford", "dover", "tallahassee", "atlanta",
                "honolulu", "boise", "springfield", "indianapolis", "des moines",
                "topeka", "frankfort", "baton rouge", "augusta", "annapolis",
                "boston", "lansing", "saint paul", "jackson", "jefferson city",
                "helena", "lincoln", "carson city", "concord", "trenton",
                "santa fe", "albany", "raleigh", "bismark", "columbus",
                "oklahoma city", "salem", "harrisburg", "providence", "columbia",
                "pierre", "nashville", "austin", "salt lake city", "montpelier",
                "richmond", "olympia", "charleston", "madison", "cheyenne" ];

var randomStateNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                         15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                         28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                         41, 42, 43, 44, 45, 46, 47, 48, 49];

// variable to store the current letter guessed
var userGuess;

//var sound = new Audio();

// When DOM loads, wait for start button click
$(document).ready(function() {

    $("#hangman-image").attr("src", "assets/images/hangman-6.png");

    reset();
});

/*
 * buildEmptyWord()
 * Generate an initial word of underscores.
 */
function buildEmptyWord() {

    emptyWord = [];

    for (var i = 0; i < wordToGuess.length; i++) {
        emptyWord[i] = "_";
    }
}

/*
 * buildIndexes(guess)
 * Determine which characters in wordToGuess are the parameter, "guess".
 * Returns an array of indexes.
 */
function buildIndexes(guess) {

    var arrayOfIndexes = [];

    for (var i = 0; i < wordToGuess.length; i++) {

        if(wordToGuess.charAt(i) === guess) {
            arrayOfIndexes.push(i);
        }
    }

    return (arrayOfIndexes);
}

/*
 * handleSpaces()
 * Since some strings may contain spaces, check to see if there is one in the current
 * wordToGuess.  If there is a space, get the index and insert it into the emptyWord array.
 */
function handleSpaces() {

    if(wordToGuess.includes(" ") !== -1) {
        var indexes = buildIndexes(" ");
    }

    for(var i = 0; i < indexes.length; i++) {
        emptyWord[indexes[i]] = " ";
    }
}

/*
 * reset()
 * Reset for new word.
 */
function reset() {

    guessedLetters = [];
    guessesString = "";
    guesses = 6;

    // Refresh display
    var refreshedHTML =  "<p>Wins: " + wins + "</p>" +
                            "<p>Losses: " + losses + "</p>" +
                            "<p>Guesses Left: 6</p>";

    $("#status").html(refreshedHTML);

    if(wordCount < maxWords) {

        wordToGuess = states[randomStateNumber.splice(Math.floor(Math.random() *
                                                        randomStateNumber.length), 1)];
        wordCount++;
        buildEmptyWord();
        handleSpaces();

        // reset hangman image
        document.getElementById("hangman-image").src = "assets/images/hangman-6.png";


        $("#guesses-used").html("<p>Your Guesses so far: </p>");

        $("#word-to-guess").html(emptyWord);
    }

    else {
        $("#guesses-used").html("<b>GAME OVER</b>");
    }
}

function playGame() {
    // check for valid input
    if (letters.indexOf(userGuess) === -1) {

        alert("Input must be a letter!");
    }

    else {
        
        // if letter has not already been guessed
        if (guessedLetters.indexOf(userGuess) === -1) {

            // if userGuess is not in wordToGuess
            if (!wordToGuess.includes(userGuess)) {

                guesses--;

                var imageLink = "assets/images/hangman-";
                imageLink = imageLink.concat(guesses);
                imageLink = imageLink.concat(".png");

                $("#hangman-image").attr("src", imageLink);

                sound.src = "assets/audio/wrong.wav";
                sound.play();
            }

            // userGuess is in wordToGuess
            else {

                // get indexes of occurrences of userGuess in wordToGuess
                var indexes = buildIndexes(userGuess); 

                // use indexes to update the emptyWord array
                for(i = 0; i < indexes.length; i++) {
                    emptyWord[indexes[i]] = userGuess;
                }

                // overwrite the emptyWord
                $("#word-to-guess").html(emptyWord);

                // sound.src = "assets/audio/correct.mp3";
                // sound.play();
            }

            // add guess to guessedLetters
            guessedLetters.push(userGuess);

            // if this is not the first guessed letter...
            if (guessesString.length) {

                // ...add ", "before guessed letter
                guessesString = guessesString.concat(", ");
            }

            // add guess to the string of guesses
            guessesString = guessesString.concat(userGuess);

            // build text to display in the div #game
            var updatedHTML =  "<p>Wins: " + wins + "</p>" +
                                "<p>Losses: " + losses + "</p>" +
                                "<p>Guesses Left: " + guesses + "</p>";

            $("#status").html(updatedHTML);
            $("#guesses-used").html("<p>Your Guesses so far: " +
                                        guessesString + "</p>");

            // If there are no more "_" characters in emptyWord, WINNER!!!
            if(!emptyWord.includes("_")) {

                wins++;

                // sound.src = "assets/audio/upchime.mp3";
                // sound.play();

                setTimeout(reset, 1000);
            }

            // Did the user lose?
            else if (guesses === 0) {

                losses++;
                
                // sound.src = "assets/audio/bell-toll.wav";
                // sound.play();

                $("#word-to-guess").html(wordToGuess);
                setTimeout(reset,1000);
            }
        }
    }
}

// wait for any key to start
document.onkeyup = function(event) {

    // Determines which key was pressed.
    userGuess = event.key;

    playGame(userGuess);
};

$(".key").on("click", function () {

    userGuess = $(this).attr("letter");

    playGame()

});

$("#reset-button").on("click", function () {

    wins = 0;
    losses = 0;

    randomStateNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                         15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                         28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                         41, 42, 43, 44, 45, 46, 47, 48, 49];
    wordCount = 0;
    reset();
});