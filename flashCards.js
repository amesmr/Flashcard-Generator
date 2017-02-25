// dependency for inquirer npm package
var inquirer = require("inquirer");
var fs = require("fs");
var os = require("os");

questions = [{
        q: "Each of a classic Rubik's Cube six faces is covered by ... stickers.",
        a: "9"
    },
    {
        q: "Bruce Willis played a convict turned time traveler in ....",
        a: "12 Monkeys"
    },
    {
        q: "1,024 Gigabytes is equal to one ....",
        a: "terabyte"
    },
    {
        q: "In our solar system ... rotate clockwise.",
        a: "Venus and Uranus"
    },
    {
        q: "One kilobyte is equal to ... bytes.",
        a: "1024"
    },
    {
        q: "The ... is the world’s largest and most powerful particle accelerator.",
        a: "Large Hadron Collider"
    },
    {
        q: "The largest volcano ever discovered in our solar system is located on ....",
        a: "Mars"
    },
    {
        q: "... is an ancient analog computer that was discovered by divers off a Greek island in 1900.",
        a: "Antikythera mechanism"
    },
    {
        q: "... is the most abundant element in the earth's atmosphere.",
        a: "Nitrogen"
    },
    {
        q: "... was the name of the first electronic general-purpose computer.",
        a: "ENIAC"
    },
    {
        q: "... is the main protagonist in the Legend of Zelda series of video games.",
        a: "Link"
    }
]

var count = 0;

function BasicFlashcard(q, a) {
    if (this instanceof BasicFlashcard) {
        this.front = q;
        this.back = a;
        fs.writeFile("basic" + count + ".txt", "{" + os.EOL + "  front: " + this.front + ";" + os.EOL + "  back: " + this.back + os.EOL + "}", function (err) {
            if (err) throw err;
        });
    } else {
        return new BasicFlashcard(q, a);
    }
}


BasicFlashcard.prototype.showQuestion = function () {
    return this.front;
};

function ClozeFlashcard(q, a) {
    if (this instanceof ClozeFlashcard) {
        this.text = q;
        this.cloze = a;
        fs.writeFile("cloze" + count + ".txt", "{" + os.EOL + "  text: " + this.text + ";" + os.EOL + "  cloze: " + this.cloze + os.EOL + "}", function (err) {
            if (err) throw err;
        });
    } else {
        return new ClozeFlashcard(q, a);
    }
}


ClozeFlashcard.prototype.showAnswer = function () {
    return this.cloze;
};

var count = 0;
var right = 0;
var wrong = 0;

function askQuestion() {

    var basic = new BasicFlashcard(questions[count].q, questions[count].a);
    var cloze = new ClozeFlashcard(questions[count].q, questions[count].a);

    inquirer.prompt([{
        name: "answer",
        message: basic.showQuestion()
    }]).then(function (answ) {
        // basic here
        if (answ.answer.toLowerCase() == basic.back.toLowerCase()) {
            console.log("That's correct!! The answer is: " + basic.back + "\n\n");
            right++;
        } else {
            console.log("Sorry.  The correct answer is: " + basic.back + "\n\n");
            wrong++;
        }
        // cloze-deleted here
        var temp = cloze.text.replace("...", cloze.cloze);
        if (answ.answer.toLowerCase() == cloze.cloze.toLowerCase()) {
            console.log("That's correct.  " + temp + "\n\n");
            right++;
        } else {
            console.log("Sorry.  " + temp + "\n\n");
            wrong++;
        }

        if (count < questions.length - 1) {
            count++;
            askQuestion();
        } else {
            console.log("You have " + right + " right answers and " + wrong + " wrong answers.")
            inquirer.prompt([{
                name: "restart",
                message: "Play again?",
                type: "confirm"
            }]).then(function (answ) {
                if (answ.restart) {
                    count = 0;
                    right = 0;
                    wrong = 0;
                    askQuestion();
                }
            });
        }
    });
}

console.log("\n\nHere We Go!");
askQuestion();