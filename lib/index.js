var cache = require("./cache");
var utils = require("./utils");

var defaults = {
    ttl: 600
};

module.exports = function(options){
    if(options === undefined)
        throw new Error("Configuration not provided");
        
    cache.initialize(utils.coalesce(options.ttl, defaults.ttl));
    
    return function(req, res, next){
        
    }
}