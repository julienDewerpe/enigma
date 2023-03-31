$('#input').keyup(function(e) {
    input = $(this).val();
    validInput = input.replace(/([^a-zA-Z\s]+)/gi, '').toUpperCase();
    $(this).val(validInput);
    updateOutput();
});

var updateOutput = function() {
    $('#output').val($('#input').val());
}