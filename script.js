const containerSize = 400;
const flashTime = 2000;

let boardSize = [9, 9, 16, 16, 16, 25, 25, 25, 36, 36, 36, 36, 49, 49, 49, 49, 49, 49];
let whiteAmount = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
let marginAmount = [16, 16, 12, 12, 12, 10, 10, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
let flashOngoing = false;

let level = 0;
let lives = 3;

let wrongClicks = 0;
let rightClicks = 0;

let coordinates;


$('#start button').click(() => {
    $('#game').css({ 'display': 'flex' });
    $('#info').css({ 'display': 'flex' });
    $('#start').css({ 'display': 'none' });
    $('#end').css({ 'display': 'none' });

    insertSquares();

});

function endGame() {
    $("#end span").text(`Score: ${level + 1}`);


    $('#game').css({ 'display': 'none' });
    $('#info').css({ 'display': 'none' });
    $('#end').css({ 'display': 'flex' });

    $('#end button').click(() => {
        lives = 3;
        level = 0;
        $('#start button').click();
    });
}

function insertSquares() {

    $("#level span").text(`${level + 1}`);
    $("#lives span").text(`${lives}`);

    $('#game').empty();

    wrongClicks = 0;
    rightClicks = 0;

    coordinates = getCoordinates(whiteAmount[level])

    const rowAmount = Math.sqrt(boardSize[level]);
    const squareSize = (containerSize - (rowAmount - 1) * marginAmount[level]) / rowAmount;

    for (let i = 0; i < rowAmount; i++) {
        for (let j = 0; j < rowAmount; j++) {

            let square = $("<div></div>");
            square.addClass('square');
            square.addClass('unclicked');
            square.attr('id', `${i} ${j}`);
            square.css({
                'height': `${squareSize}px`,
                'width': `${squareSize}px`
            });

            if (j != rowAmount - 1) {
                square.css({ 'margin-right': `${marginAmount[level]}px` });
            }

            $('#game').append(square);

        }
    }

    $(".square").click(squareClick);

    flashHints();
}

function getCoordinates(amount) {
    let coordinates = [];

    while (coordinates.length < amount) {
        let x = Math.floor(Math.random() * Math.sqrt(boardSize[level]));
        let y = Math.floor(Math.random() * Math.sqrt(boardSize[level]));

        if (coordinates.find((e) => {
            return e[0] == x && e[1] == y;
        }) == undefined)
            coordinates.push([x, y]);
    }

    return coordinates;
}


function squareClick() {

    if ($(this).hasClass('unclicked') && !flashOngoing) {

        let clickCoord = $(this).attr('id').split(' ');

        if (coordinates.find((e) => {
            return e[0] == clickCoord[0] && e[1] == clickCoord[1];
        }) != undefined) {

            $(this).addClass('clickedRight');
            $(this).toggleClass('unclicked');


            $(this).css({ 'transform': 'rotateX(180deg)' })

            rightClicks++;

            if (rightClicks == whiteAmount[level]) {

                level++;

                flashOngoing = true;
                reloadOnEnd();
            }
        }

        else {
            $(this).addClass('clickedWrong');
            $(this).toggleClass('unclicked');

            $(this).css({ 'transform': 'rotateX(180deg)' });


            wrongClicks++;
            if (wrongClicks == 3) {
                lives--;
                flashOngoing = true;

                if (lives > 0)
                    reloadOnEnd();

                else
                    setTimeout(() => {
                        endGame();
                    }, 500);
            }
        }
    }
}

function reloadOnEnd() {

    setTimeout(() => {
        toggleOnEnd()

    }, 500);

    setTimeout(() => {
        flashOngoing = true;

        insertSquares(level + 2);
    }, flashTime / 2);
}

function flashHints() {
    flashOngoing = true;
    setTimeout(() => {
        toggleClassToAll("white", "on")

    }, 500);


    setTimeout(() => {
        toggleClassToAll("white", "off")
        flashOngoing = false;
    }, flashTime);
}

function toggleClassToAll(className, onOff) {
    let squares = $("#game").children();

    for (let i = 0; i < boardSize[level]; i++) {

        let sqCoord = $(squares[i]).attr('id').split(' ');

        if (coordinates.find((e) => {
            return e[0] == sqCoord[0] && e[1] == sqCoord[1];
        }) != undefined) {

            if (onOff == 'on')
                $(squares[i]).css({ 'transform': 'rotateX(180deg)' });
            else
                $(squares[i]).css({ 'transform': 'rotateX(0deg)' });

            $(squares[i]).toggleClass(className);

            if (className == 'clickedRight')
                $(squares[i]).toggleClass('unclicked');
        }
    }
}

function toggleOnEnd() {
    let squares = $("#game").children();

    for (let i = 0; i < boardSize[level]; i++) {

        if (!$(squares[i]).hasClass('unclicked')) {
            $(squares[i]).css({ 'transform': 'rotateX(0deg)' });
            $(squares[i]).toggleClass('unclicked');


            if ($(squares[i]).hasClass('clickedRight'))
                $(squares[i]).toggleClass('clickedRight');

            if ($(squares[i]).hasClass('clickedWrong'))
                $(squares[i]).toggleClass('clickedWrong');
        }
    }
}