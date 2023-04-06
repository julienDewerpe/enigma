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

$('#input').keyup(function(e) {
    input = $(this).val();
    validInput = input.replace(/([^a-zA-Z\s]+)/gi, '').toUpperCase();
    $(this).val(validInput);
    updateOutput();
});

var updateOutput = function() {
    $('#output').val($('#input').val());
}