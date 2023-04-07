//Fonctions de vérification
var isValidInput = function(input){
    return /^[a-zA-Z]*$/g.test(input);
}

var isAlphabeticChar = function(input){
    return /^[a-zA-Z]*$/g.test(input);
}

var isDifferentChar = function(input, current){
    return (input !== current);
}

var isValidPlugboardConfig = function(input, current){
    return (isAlphabeticChar(input) && isDifferentChar(current));
}

//récupérer la configuration du plugboard
var getPlugboardConfig = function() {
    var pairs = $('.plugboard').map(function() {
        thisLetter = $(this).attr('id').slice(-1);
        otherLetter = $(this).val().toUpperCase();

        if(otherLetter) {
            return (thisLetter + otherLetter);
        }
    }).get();

    return pairs;
}

//affichage dynamique de la configuration du plu
$('.plug-settings').keydown(function(e) {
    e.preventDefault();

    thisLetter = $(this).attr('id').slice(-1);
    otherLetter = String.fromCharCode(e.keyCode).toUpperCase();
    previousLetter = $(this).attr('previousLetter');

    // Erase any other letter that is currently connected to the
    // letter we want right now
    if (isAlphabeticChar(otherLetter)) {
        currentOtherLetter = $('#plug-' + otherLetter).val();
        if (currentOtherLetter)
            $('#plug-' + currentOtherLetter).val('');
    }

    // Erasing the letter that we were previously connected to
    if (previousLetter)
        $('#plug-' + previousLetter).val('');

    if (isValidPlugboardConfig(otherLetter, thisLetter)) {
        $(this).val(otherLetter);
        $(this).attr('previousLetter', otherLetter);
        $('#plug-' + otherLetter).val(thisLetter);
        $('#plug-' + otherLetter).attr('previousLetter', thisLetter);
    } else {
        $(this).attr('previousLetter', '');
        $(this).val('');
    }

    updateOutput();
});


//Récuperer la chaine de caractères + autoriser que les lettres et les espaces
$('#input').keyup(function(e) {
    input = $(this).val();
    validInput = input.replace(/([^a-zA-Z\s]+)/gi, '').toUpperCase();
    $(this).val(validInput);
    updateOutput();
});

//fonction pour ecrire dans un input 
var updateOutput = function() {
    $('#output').val($('#input').val());
}