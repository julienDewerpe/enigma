var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//Configuration du PlugBoard dela machine
//Object : PlugBoard
var Plugboard = function() {
    this.plugs = {};
    Plugboard.prototype.addPlugs.apply(this, arguments);
};

//Fonction Plugboard.addPlug : permet de faire une pair de lettre
Plugboard.prototype.addPlug = function(letter1, letter2) {
    this.plugs[letter1] = letter2;
    this.plugs[letter2] = letter1;
};

//Fonction Plugboard.addPlugs : permet de stocker les pairs de lettre
Plugboard.prototype.addPlugs = function() {
    for (var i = 0; i < arguments.length; i++) {
        var letters = arguments[i];
        this.addPlug(letters.charAt(0), letters.charAt(1));
    }
};

//function Plugboard.encode : échange les lettre en fonction des pairs qui sont définies
Plugboard.prototype.encode = function(letter) {
    if (letter in this.plugs)
        return this.plugs[letter];
    return letter;
};

//Configuration des des Rotors
//Création de l'objet Rotor 
var Rotor = function(wiringTable) {
    this.wires = {};
    this.inverseWires = {};
    this.nextRotor = null;
    this.turnoverCountdown = 26;
    this.innerRingPosition = 0;

    if (wiringTable)
        this.setWiringTable(wiringTable);
};

// setNextRotor : définit le rotor suivant
Rotor.prototype.setNextRotor = function(rotor) {
    this.nextRotor = rotor;
};

// setTurnoverLetter : définit la lettre qui entraîne le déclenchement du rotor suivant lorsqu'elle est atteinte
Rotor.prototype.setTurnoverLetter = function(letter) {
    this.turnoverCountdown = letter.charCodeAt(0) - 'A'.charCodeAt(0);

    if (this.turnoverCountdown === 0)
        this.turnoverCountdown = 26;
};

//addWire : ajoute une permutation de lettre à la liste des permutations du rotor
Rotor.prototype.addWire = function(letter1, letter2) {
    this.wires[letter1] = letter2;
};

//setWiringTable : définit la disposition des contacts électriques pour le rotor
Rotor.prototype.setWiringTable = function(wiringTable) {
    for (var i = 0; i < LETTERS.length; i++) {
        this.wires[LETTERS[i]] = wiringTable[i];
        this.inverseWires[wiringTable[i]] = LETTERS[i];
    }
};

//encode : effectue la permutation de lettre en utilisant la disposition des contacts électriques du rotor
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

//step : effectue un pas de rotation du rotor, en tournant l'anneau intérieur, en mettant à jour la liste des permutations et en vérifiant si le déclenchement du rotor suivant doit être effectué
Rotor.prototype.step = function() {
    this.stepWires();
    this.updateInverseWires();
    this.turnover();
    this.innerRingPosition += 1;
};

//stepWires : permet de déplacer les connexions entre les lettres de l'alphabet 
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

//updateInverseWires : Cette méthode est appelée à chaque fois que les fils du rotor sont décalés pour refléter les changements apportés à la correspondance des lettres
Rotor.prototype.updateInverseWires = function() {
    for (var i = 0; i < LETTERS.length; i++) {
        letter = LETTERS[i];
        encodedLetter = this.wires[letter];
        this.inverseWires[encodedLetter] = letter;
    }
};

//turnover : utilisée pour gérer le déclenchement du rotor suivant
Rotor.prototype.turnover = function() {
    this.turnoverCountdown -= 1;

    if (this.turnoverCountdown === 0) {
        if (this.nextRotor)
            this.nextRotor.step();
        this.turnoverCountdown = 26;
    }
};

//création des Rotors
var RotorA = function() {
    var rotor = new Rotor('QAZKBOUJVPDMFSNTRXYEWGHCLI');
    rotor.setTurnoverLetter('Y');
    return rotor;
};

var RotorB = function() {
    var rotor = new Rotor('ENQWZPFSBOCLGHKTMIYARDXVUJ');
    rotor.setTurnoverLetter('P');
    return rotor;
};

var RotorC = function() {
    var rotor = new Rotor('AQDHYPZNIRFOGXUWMJLTVKCEBS');
    rotor.setTurnoverLetter('O');
    return rotor;
};

var RotorI = function() {
    var rotor = new Rotor('ZENVDCLPSIAUKFWQRXMTYOGHBJ');
    rotor.setTurnoverLetter('X');
    return rotor;
};

var RotorII = function() {
    var rotor = new Rotor('IFGWEVZRMLTPNHSQCABOKJXDYU');
    rotor.setTurnoverLetter('O');
    return rotor;
};

var RotorIII = function() {
    var rotor = new Rotor('CSNMIZAJKLRXHQDEFWPTUYOBVG');
    rotor.setTurnoverLetter('K');
    return rotor;
};

var RotorIV = function() {
    var rotor = new Rotor('ADWMBJUQGOSKFITNYLERZCHPXV');
    rotor.setTurnoverLetter('J');
    return rotor;
};

var RotorV = function() {
    var rotor = new Rotor('UFPHEAYRSWJTMZNVBLCQXIKGDO');
    rotor.setTurnoverLetter('T');
    return rotor;
};

//Création du reflector
var Reflector = function() {
    this.reflectionTable = {};

    for (var i = 0; i < LETTERS.length; i++)
        this.reflectionTable[LETTERS[i]] = LETTERS[i];
};

//setReflectionTable : permet de configurer le réflecteur avec une nouvelle table de correspondance, en spécifiant une liste de correspondances sous forme d'un tableau de 26 lettres
Reflector.prototype.setReflectionTable = function(reflectionTable) {
    newReflectionTable = {};

    for (var i = 0; i < LETTERS.length; i++) {
        input = LETTERS[i];
        output = reflectionTable[i];
        newReflectionTable[input] = output;
    }

    this.reflectionTable = newReflectionTable;
};

//encode : prend une lettre en entrée et renvoie la lettre correspondante selon la table de réflexion en cours 
Reflector.prototype.encode = function(letter) {
    return this.reflectionTable[letter];
};

var ReflectorConf = function() {
    var reflector = new Reflector();
    reflector.setReflectionTable('ZYXWVUTSRQPONMLKJIHGFEDCBA');
    return reflector;
};

//Configuration de la machine
var Machine = function() {
    this.debug = false;
    this.plugboard = null;
    this.rotors = null;
    this.reflector = null;
};

//log : afficher des messages de débogage à la console
Machine.prototype.log = function(message) {
    if (this.debug)
        console.log(message);
};

//setDebug : est utilisée pour activer ou désactiver le mode de débogage
Machine.prototype.setDebug = function(debug) {
    this.debug = debug;
};

//setplugboard : définir la table de connexion du plugboard de la machine
Machine.prototype.setPlugboard = function(plugboard) {
    this.plugboard = plugboard;

    this.log('Machine plugboard table');
    this.log(this.plugboard.plugs);
    this.log('');
};

//setRotors : définir les rotors de la machine
Machine.prototype.setRotors = function(premierRotor, deuxiemeRotor, troisiemeRotor, quatriemeRotor, cinquiemeRotor, sixiemeRotor, septiemeRotor, huitiemeRotor) {
    this.rotors = [premierRotor, deuxiemeRotor, troisiemeRotor, quatriemeRotor, cinquiemeRotor, sixiemeRotor, septiemeRotor, huitiemeRotor];
    this.rotors[0].setNextRotor(this.rotors[1]);
    this.rotors[1].setNextRotor(this.rotors[2]);
    this.rotors[2].setNextRotor(this.rotors[3]);
    this.rotors[3].setNextRotor(this.rotors[4]);
    this.rotors[4].setNextRotor(this.rotors[5]);
    this.rotors[5].setNextRotor(this.rotors[6]);    
    this.rotors[6].setNextRotor(this.rotors[7]);

    this.log('Machine rotors table');

    for (var i = 0; i < this.rotors.length; i++) {
        this.log('Rotor ' + i + ' table');
        this.log(this.rotors[i].wires);
        this.log('');
    }
};

//setReflector : définir le réflecteur de la machine
Machine.prototype.setReflector = function(reflector) {
    this.reflector = reflector;

    this.log('Machine reflector table');
    this.log(this.reflector.reflectionTable);
    this.log('');
};

//encode : encoder une lettre avec la machine
Machine.prototype.encode = function(letter) {
    if (this.rotors[1].turnoverCountdown == 1 &&
        this.rotors[2].turnoverCountdown == 1 &&
        this.rotors[3].turnoverCountdown == 1 &&
        this.rotors[4].turnoverCountdown == 1 &&
        this.rotors[5].turnoverCountdown == 1 &&
        this.rotors[6].turnoverCountdown == 1 &&
        this.rotors[7].turnoverCountdown == 1){
        this.rotors[1].step();
    }

    this.rotors[0].step();

    this.log('Machine encoding');

    this.log('letter: ' + letter);

    var plugboardDirect = this.plugboard.encode(letter);
    this.log('plugboardDirect: ' + letter + ' -> ' + plugboardDirect);

    var rotorsDirect = this.encodeWithRotors(plugboardDirect);

    var reflectorInverse = this.reflector.encode(rotorsDirect);
    this.log('reflectorInverse: ' + rotorsDirect + ' -> ' + reflectorInverse);

    var rotorsInverse = this.encodeInverseWithRotors(reflectorInverse);

    var plugboardInverse = this.plugboard.encode(rotorsInverse);
    this.log('plugboardInverse: ' + rotorsInverse + ' -> ' + plugboardInverse);

    this.log('');

    return plugboardInverse;
};

//encodeWithRotors : encoder une lettre avec les rotors de la machine
Machine.prototype.encodeWithRotors = function(letter) {
    for (var i = 0; i < this.rotors.length; i++) {
        output = this.rotors[i].encode(letter);
        this.log('rotor ' + i + ' direct: ' + letter + ' -> ' + output);

        letter = output;
    }

    return output;
};

//encodeInverseWithRotors : encoder une lettre avec les rotors de la machine, mais dans l'ordre inverse
Machine.prototype.encodeInverseWithRotors = function(letter) {
    for (var i = this.rotors.length - 1; i >= 0; i--) {
        output = this.rotors[i].encode(letter, true);
        this.log('rotor ' + i + ' inverse: ' + letter + ' -> ' + output);

        letter = output;
    }

    return output;
};

//encodeLetters : encoder plusieurs lettres d'un coup
Machine.prototype.encodeLetters = function(letters) {
    var result = '';

    for (var i = 0; i < letters.length; i++)
        result += this.encode(letters[i]);

    return result;
};