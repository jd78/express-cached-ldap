function Utils(){}

Utils.prototype.coalesce = function(obj, other){
    if(!(obj === null) && !(obj === undefined))
        return obj;
    return other;
};

module.exports = new Utils();