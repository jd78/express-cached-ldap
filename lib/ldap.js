var cache = require("./cache");
var q = require("q");

function LdapService(activeDirectory){
    this.ad = activeDirectory;
}

LdapService.prototype.isAuthorized = function(username){
    var self = this;
    return q.Promise(function(resolve, reject){
        cache.get(username).then(function(authorized){
            if(authorized!=null)
                return resolve(authorized);
            self.ad.findUser(username, function(err, user){
                if(err) return reject(err);
                var isAuthorized = user !== undefined ? true : false;
                cache.set(username, isAuthorized);
                return resolve(isAuthorized);
            });
        });
    });
};

module.exports = LdapService;


