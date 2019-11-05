let language = navigator.language; // pairnw thn glwssa tou browser

// se periptwsh pou den vreis "-" sto string (px. en-US) krata to ws exei
// alliws pare to string prin tin paula.
// language = (language.indexOf('-') === -1) ? language : language.substr(0, language.indexOf('-'));
language = language.substr(0, language.indexOf('-')) || language;

// let limit = ($(window).width() < 768) ? 10 : 20; // an o user einai apo mobile limit=10 alliws desktop||tablet limit=20
let limit = (!($(window).width() < 768) + 1) * 10; // limit set xoris branching 

let typingTimer = Function;                // timer identifier function for debounce
let doneTypingInterval = 250;  // xronos se ms (0.5 seconds)

// apothikeysi se metavliti gia taxitita
const searchText = $('.search');
const searchButton = $('#btn');
let resultsList = $('.results');

// se keyup, ksekina ton counter
searchText.keyup(function () {
    clearTimeout(typingTimer);

    let inputLen = searchText.val().length;
    if (inputLen > 1) { // an to length tou searh term einai > 1
        typingTimer = setTimeout(doneTyping, doneTypingInterval); // teleiwse pithanws to typing, kalese tin done typing
    } else { //if (!inputLen) { // an to text den exei contents na svinei to results div
        resultsList.empty();
        searchButton.attr('disabled', true);
        resultsList.hide();
    }
});

//user is "finished typing," do something
function doneTyping() {
    resultsList.empty(); // katharise ta proigoumena results
    let keywords = searchText.val();
    const url = `http://35.180.182.8/search`;
    resultsList.show();
    $.ajax({
        type: 'GET',
        url: url,
        data: { //ES6 object property name = value by default
            keywords,
            language,
            limit,
        },
        success: data => successFunc(data),
        statusCode: {
            400: function () {
                alert('Errors in specified keywords and/or language.');
            },
            500: function () {
                alert('Internal server error.')
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function successFunc(data) {
    if (data.entries.length) { // an ta entries einai panw apo 0
        $.each(data.entries, (index, item) => { // gia kathe entry prosthese to onoma
            resultsList.append(`<div class="result" onclick="">${item.name}</div>`);
        });
        $('.result').click(function () { // se click kapiou result, vale to sto search text kai kripse ta results
            searchText.val(this.innerText);
            searchButton.attr('disabled', false);
            resultsList.hide(); // .css('display', 'none');
        });
        searchButton.click(() => {
            window.location.href = `https://google.com/search?q=${searchText.val()}`;
        });
    }
    else { // an den vrethikan results, emfanise "no results found" kai disable to button
        searchButton.attr('disabled', true);
        resultsList.append(`<div class="result">No Results Found.</div>`);
    }
}



