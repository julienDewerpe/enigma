var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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