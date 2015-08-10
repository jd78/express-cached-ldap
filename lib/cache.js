var q = require("q");
var Cache = require("node-cache");

var cacheManager;

function checkCacheInitializedDecorator(fun){
    return function(){
        if(cacheManager === undefined)
            throw new Error("Cachemanager not initialized, call initialize first.");
        return fun.apply(this, arguments);
    };
}

module.exports = {
    initialize: function(ttl) { cacheManager = new Cache({ stdTTL: ttl }); },
    set: checkCacheInitializedDecorator(function(key, value) { cacheManager.set(key, value); }),
    get: checkCacheInitializedDecorator(function(key) {
        return q.Promise(function(resolve, reject){
            cacheManager.get(key, function(err, value){
                if(err) return reject(err);
                if(value == undefined) return resolve(null);
                resolve(value);
            });
        });
    }),
    remove: checkCacheInitializedDecorator(function(key) { cacheManager.del(key) })
};
