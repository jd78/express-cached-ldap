var cache = require("./cache");
var utils = require("./utils");

var defaults = {
    ttl: 600
};

module.exports = function(options){
    if(options === undefined)
        throw new Error("Configuration not provided");
    if(options.ldapUrl === undefined)
        throw new Error("ldapUrl parameter not provided");
    if(options.baseDN === undefined)
        throw new Error("baseDN parameter not provided");
    if(options.ldapUsername === undefined)
        throw new Error("ldapUsername parameter not provided");
    if(options.ldapPassword === undefined)
        throw new Error("ldapPassword parameter not provided");
        
    cache.initialize(utils.coalesce(options.ttl, defaults.ttl));
    
    return function(req, res, next){
        
    }
}