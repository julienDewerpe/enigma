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

$('#input').keyup(function(e) {
    input = $(this).val();
    validInput = input.replace(/([^a-zA-Z\s]+)/gi, '').toUpperCase();
    $(this).val(validInput);
    updateOutput();
});

var updateOutput = function() {
    $('#output').val($('#input').val());
}