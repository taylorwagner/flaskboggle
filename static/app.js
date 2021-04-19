class BoggleGame {
    //make a new game at BoggleGame id

    constructor(boardId, secs = 60) {
        this.secs = secs; //length of the game
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);

        //every 1000ms, "tick"
        this.timer = setInterval(this.tick.bind(this), 1000);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    //show word in the list of words

    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word}));
    }

    //show score in html

    showScore() {
        $(".score", this.board).text(this.score);
    }

    //show status message

    showMessage(message, cls) {
        $(".message", this.board)
        .text(message)
        .removeClass()
        .addClass(`msg ${cls}`)
    }

    //handle the submission of a word: if the word is unqiue and valid, score and show the word

    async handleSubmit(e) {
        e.preventDefault();
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word) return;

        if (this.word.has(word)) {
            this.showMessage(`Already found ${word}`, "err");
            return;
        }

        //check server for validity of word

        const res = await axios.get("/check-word", { params: { word: word }});
        if (res.data.result === "not-word") {
            this.showMessage(`${word} is not a valid English word`, "err");
        } else if (res.data.result === "not-on-board") {
            this.showMessage(`${word} is not a valid word from the board`, "err");
        } else {
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMessage(`Added: ${word}`, "ok");
        }

        $word.val("").focus();
    }

    //update timer in the DOM

    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    //handle a second passing in the game

    async tick() {
        this.secs -= 1; //counting down
        this.showTimer(); //reflecting the countdown on timer

        if(this.secs === 0) { //no more time left
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    //end of game --> score game and update the message

    async scoreGame() {
        $(".add-word", this.board).hide();
        
        const res = await axois.get("/post-score", { score: this.score });

        if(res.data.brokeRecord) {
            this.showMessage(`New record!! --> ${this.score}`, "ok");
        } else {
            this.showMessage(`Final score: ${this.score}`, "ok");
        }
    }
}