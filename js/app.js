 "use strict";

var firstTile = null;
var secondTile = null;
var pics = [];
var userCanClick = true;
var timer = null;

// Makes array of the 32 pictures
for (var i = 1; i < 33; i++) {
    pics.push(i);
}

// Randomly chooses which 8 pictures to use,
// doubles that selection
// then shuffles again to create board arrangement
pics = _.shuffle(pics).slice(0, 8)
pics = pics.concat(pics);
pics = _.shuffle(pics);

function onReady () {
    $("#win-message").hide();

    // Files board with images
    var ul = $("#tiles");
    for (var i = 0; i < 16; i++) {
        var newLI = $(document.createElement("li"));
        var newImg = $(document.createElement("img"));
        newImg.attr("src", "img/tile-back.png")
        newImg.data("number", pics[i]); // Which picture
        newImg.data("position", i);     // What position on the board it's in
        newImg.data("flipped", false);  // If it's flipped face up
        newImg.click(onTileClick);

        newLI.append(newImg);
        ul.append(newLI);
    }

    // New game button clicked, reload game
    $("#new-game").click(function() {
        window.location.reload();
    });

    var startTime = _.now();

    timer = window.setInterval(function() {
        $("#current-time").html(Math.floor((_.now() - startTime) / 1000));
    }, 1000);
}

function onTileClick() {
    if (userCanClick && !$(this).data("flipped")) {
        // User can click and the tile is not flipped
        // Flips tile
        $(this).attr("src", "img/tile" + $(this).data("number") + ".jpg");
        $(this).data("flipped", true);
        $(this).addClass("selected");

        // No other tile currently selected
        if (firstTile == null) {
            firstTile = $(this);
        } else {
            // Not the same tile as one already selected, or any face up
            userCanClick = false; // Two tiles selected, user cannot click

            if (firstTile.data("number") == $(this).data("number")) {
                // Match!
                // Increments match counter
                var matchElement = $("#matches");
                var matches = parseInt(matchElement.html());
                matchElement.html(matches + 1);

                // Decrements pairs remaining counter
                var pairsremainingElement = $("#remaining");
                var remaining = parseInt(pairsremainingElement.html());
                pairsremainingElement.html(remaining - 1);

                firstTile.removeClass("selected");
                $(this).removeClass("selected");
                firstTile.addClass("matched");
                $(this).addClass("matched");

                if ((remaining - 1) == 0) {
                    // User wins
                    clearInterval(timer);
                    $("#win-message").show();
                } else {
                    // No win,flip tiles back over
                    firstTile = null;
                    userCanClick = true;
                }
            } else {
                // Not a match, increments mismatch counter
                var mismatchElement = $("#mismatches");
                var mismatches = parseInt(mismatchElement.html());
                mismatchElement.html(mismatches + 1);

                secondTile = $(this);

                firstTile.addClass("mismatched");
                secondTile.addClass("mismatched");

                // One second after second tile click
                setTimeout(flipCards, 1000);
            }
        }
    }
}

function flipCards() {
    firstTile.attr("src", "img/tile-back.png");
    firstTile.data("flipped", false);
    firstTile.removeClass("mismatched");
    firstTile.removeClass("selected");
    secondTile.attr("src", "img/tile-back.png");
    secondTile.data("flipped", false);
    secondTile.removeClass("mismatched");
    secondTile.removeClass("selected");

    firstTile = null;
    secondTile = null;
    userCanClick = true;
}

$(onReady);
