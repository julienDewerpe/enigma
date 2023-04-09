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
    var pairs = $('.plug-settings').map(function() {
        thisLetter = $(this).attr('id').slice(-1);
        otherLetter = $(this).val().toUpperCase();

        if(otherLetter) {
            return (thisLetter + otherLetter);
        }
    }).get();

    return pairs;
}

//récuperer la configuration (la position) des rotors
var getRotorInstance = function(pos) {
    var type = $('#rotor-type-' + pos).val();

    if (type === 'A')
        rotor = new RotorA();
    else if (type === 'B')
        rotor = new RotorB();
    else if (type === 'C')
        rotor = new RotorC();

    return rotor;
}

//affichage dynamique de la configuration du plugboard
$('.plug-settings').keydown(function(e) {
    e.preventDefault();

    thisLetter = $(this).attr('id').slice(-1);
    otherLetter = String.fromCharCode(e.keyCode).toUpperCase();
    previousLetter = $(this).attr('previousLetter');

    if (isAlphabeticChar(otherLetter)) {
        currentOtherLetter = $('#plug-' + otherLetter).val();
        if (currentOtherLetter)
            $('#plug-' + currentOtherLetter).val('');
    }

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

//encode du message
var encode = function(input) {
    getPlugboardConfig();
    console.log(getPlugboardConfig());
    var machine = new Machine();

    var plugboard = new Plugboard();
    plugboard.addPlugs.apply(plugboard, getPlugboardConfig());
    machine.setPlugboard(plugboard);

    var leftRotor = getRotorInstance('left');
    var middleRotor = getRotorInstance('middle');
    var rightRotor = getRotorInstance('right');

    machine.setRotors(leftRotor, middleRotor, rightRotor, new RotorI(), new RotorII(), new RotorIII(), new RotorIV(), new RotorV());

    var reflector = new ReflectorConf();
    machine.setReflector(reflector);

    return machine.encodeLetters(input);
};

//Récuperer la chaine de caractères + autoriser que les lettres et les espaces
$('#input').keyup(function(e) {
    input = $(this).val();
    validInput = input.replace(/([^a-zA-Z]+)/gi, '').toUpperCase();
    $(this).val(validInput);
    updateOutput();
});

//fonction pour ecrire dans un input 
var updateOutput = function() {
    $('#output').val(encode($('#input').val()));
}