// dependency for inquirer npm package
var inquirer = require("inquirer");
var fs = require("fs");
// var os = require("os");


// Array for generating initial questions and generating files
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
// basic constructor
function BasicFlashcard(q, a) {
    if (this instanceof BasicFlashcard) {
        this.front = q;
        this.back = a;
        this.writeFile();
    } else {
        return new BasicFlashcard(q, a);
    }
}

BasicFlashcard.prototype.writeFile = function () {
    if (!fileExistsSync("basic" + count + ".txt") || fs.readFileSync("basic" + count + ".txt") == "") {
        fs.writeFile("basic" + count + ".txt", "{  \"front\": \"" + this.front + "\",\"back\": \"" + this.back + "\"}", function (err) {
            if (err) throw err;
        });
    }
}
BasicFlashcard.prototype.showQuestion = function () {
    return this.front;
};

// Cloze constructor
function ClozeFlashcard(q, a) {
    if (this instanceof ClozeFlashcard) {
        this.text = q;
        this.cloze = a;
        this.writeFile();
    } else {
        return new ClozeFlashcard(q, a);
    }
}

ClozeFlashcard.prototype.writeFile = function () {
    if (!fileExistsSync("cloze" + count + ".txt") || fs.readFileSync("cloze" + count + ".txt") == "") {
        fs.writeFile("cloze" + count + ".txt", "{  \"text\": \"" + this.text + "\",  \"cloze\": \"" + this.cloze + "\"}", function (err) {
            if (err) throw err;
        });
    }
}
ClozeFlashcard.prototype.showAnswer = function () {
    return this.cloze;
};

ClozeFlashcard.prototype.wholeAnswer = function () {
    return this.text.replace("...", this.cloze);
};



var count = 0;
var right = 0;
var wrong = 0;

function fileExistsSync(file) {
    try {
        fs.accessSync(file);
        return true;
    } catch (e) {
        return false;
    }
}

function askQuestion() {
    if (fileExistsSync("basic" + count + ".txt") && fileExistsSync("cloze" + count + ".txt")) {
        // try populating the object from the file, first
        var basicRaw = fs.readFileSync("basic" + count + ".txt", "utf8");
        var basicObj = JSON.parse(basicRaw);
        var basic = BasicFlashcard(basicObj.front, basicObj.back);
        var clozeRaw = fs.readFileSync("cloze" + count + ".txt", "utf8");
        var clozeObj = JSON.parse(clozeRaw);
        var cloze = ClozeFlashcard(clozeObj.text, clozeObj.cloze);
    } else {
        // otherwise, just use the array for file generation
        // use the new call explicitly here just to ensure that it is working as designed
        var basic = new BasicFlashcard(questions[count].q, questions[count].a);
        var cloze = new ClozeFlashcard(questions[count].q, questions[count].a);
    }
    inquirer.prompt([{
        name: "answer",
        message: basic.showQuestion()
    }]).then(function (answ) {
        // basic here
        if (answ.answer.toLowerCase() == basic.back.toLowerCase()) {
            console.log("That's CORRECT! The answer is: \n" + basic.back + "\n\n");
            right++;
        } else {
            console.log("SORRY! The correct answer is:\n" + basic.back + "\n\n");
            wrong++;
        }
        // cloze-deleted here;
        if (answ.answer.toLowerCase() == cloze.cloze.toLowerCase()) {
            console.log("That's CORRECT!\n" + cloze.wholeAnswer() + "\n\n");
            right++;
        } else {
            console.log("SORRY!\n" + cloze.wholeAnswer() + "\n\n");
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

console.log("\n\nHere We Go!\n");
askQuestion();