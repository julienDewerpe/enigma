var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//Configuration du PlugBoard dela machine
var Plugboard = function() {
    this.plugs = {};
    Plugboard.prototype.addPlugs.apply(this, arguments);
};

Plugboard.prototype.addPlug = function(letter1, letter2) {
    this.plugs[letter1] = letter2;
    this.plugs[letter2] = letter1;
};

Plugboard.prototype.addPlugs = function() {
    for (var i = 0; i < arguments.length; i++) {
        var letters = arguments[i];
        this.addPlug(letters.charAt(0), letters.charAt(1));
    }
};

Plugboard.prototype.encode = function(letter) {
    if (letter in this.plugs)
        return this.plugs[letter];
    return letter;
};

//Configuration de l'object rotor
var Rotor = function(wiringTable) {
    this.wires = {};
    this.inverseWires = {};
    this.nextRotor = null;
    this.turnoverCountdown = 26;
    this.innerRingPosition = 0;

    if (wiringTable)
        this.setWiringTable(wiringTable);
};

Rotor.prototype.setInitialPosition = function(initialPosition) {
    var letterCode = initialPosition.charCodeAt(0) - 'A'.charCodeAt(0);
    var nextRotor = this.nextRotor;
    this.nextRotor = null;

    for (var i = 0; i < letterCode; i++)
        this.step();

    this.nextRotor = nextRotor;
};

Rotor.prototype.setInnerPosition = function(innerRingPosition) {
    var numberOfSteps = innerRingPosition.charCodeAt(0) -
        'A'.charCodeAt(0);

    for (var i = 0; i < 26 - numberOfSteps; i++) {
        this.stepWires();
        this.updateInverseWires();
        this.innerRingPosition += 1;
    }
};

Rotor.prototype.setNextRotor = function(rotor) {
    this.nextRotor = rotor;
};

Rotor.prototype.setTurnoverLetter = function(letter) {
    this.turnoverCountdown = letter.charCodeAt(0) - 'A'.charCodeAt(0);

    if (this.turnoverCountdown === 0)
        this.turnoverCountdown = 26;
};

Rotor.prototype.addWire = function(letter1, letter2) {
    this.wires[letter1] = letter2;
};

Rotor.prototype.setWiringTable = function(wiringTable) {
    for (var i = 0; i < LETTERS.length; i++) {
        this.wires[LETTERS[i]] = wiringTable[i];
        this.inverseWires[wiringTable[i]] = LETTERS[i];
    }
};

Rotor.prototype.encode = function(letter, inverse) {
    var letterCode = letter.charCodeAt(0) - 'A'.charCodeAt(0);

    if (inverse) {
        offsetLetterCode = (letterCode + this.innerRingPosition) % LETTERS.length;
        if (offsetLetterCode < 0) offsetLetterCode += 26;

        return this.inverseWires[String.fromCharCode('A'.charCodeAt(0) + offsetLetterCode)];
    } else {
        outputLetterCode = this.wires[letter].charCodeAt(0) - 'A'.charCodeAt(0);

        offsetLetterCode = (outputLetterCode - this.innerRingPosition) % LETTERS.length;
        if (offsetLetterCode < 0) offsetLetterCode += 26;

        return String.fromCharCode('A'.charCodeAt(0) + offsetLetterCode);
    }
};

Rotor.prototype.step = function() {
    this.stepWires();
    this.updateInverseWires();
    this.turnover();
    this.innerRingPosition += 1;
};

Rotor.prototype.stepWires = function() {
    var newWires = {};
    var currentLetter;
    var nextLetter;

    for (var i = 0; i < LETTERS.length; i++) {
        currentLetter = LETTERS[i];
        nextLetter = LETTERS[(i + 1) % LETTERS.length];
        newWires[currentLetter] = this.wires[nextLetter];
    }

    this.wires = newWires;
};

Rotor.prototype.updateInverseWires = function() {
    for (var i = 0; i < LETTERS.length; i++) {
        letter = LETTERS[i];
        encodedLetter = this.wires[letter];
        this.inverseWires[encodedLetter] = letter;
    }
};

Rotor.prototype.turnover = function() {
    this.turnoverCountdown -= 1;

    if (this.turnoverCountdown === 0) {
        if (this.nextRotor)
            this.nextRotor.step();
        this.turnoverCountdown = 26;
    }
};
