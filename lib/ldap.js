var cache = require("./cache");
var q = require("q");

function LdapService(activeDirectory){
    this.ad = activeDirectory;
}

LdapService.prototype.isAuthorized = function(username){
    var self = this;
    return q.Promise(function(resolve, reject){
        cache.get(username).then(function(user){
            if(user!=null)
                return resolve(user);
            self.ad.findUser(username, function(err, user){
                if(err) return reject(err);
                cache.set(username, user);
                return resolve(user);
            });
        });
    });
};

module.exports = LdapService;


