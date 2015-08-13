var cache = require("./cache");
var q = require("q");
var _ = require("underscore");

function LdapService(activeDirectory, optionalGroups){
    this.ad = activeDirectory;
    this.groups = optionalGroups;
}

LdapService.prototype.isAuthorized = function(username){
    var self = this;
    return q.Promise(function(resolve, reject){
        cache.get(username).then(function(authorized){
            if(authorized!=null)
                return resolve(authorized);
            self.ad.findUser(username, function(err, user){
                if(err) return reject(err);
                var userFound = user !== undefined ? true : false;
                if(!userFound || !self.groups){
                    cache.set(username, userFound);
                    return resolve(userFound);
                }
                
                self.ad.getGroupMembershipForUser(username, function(err, groups){
                    if(err) return reject(err);
                     var authorized = _.intersection(_.map(groups, function(g) { return g.cn }), self.groups).length == self.groups.length;
                    cache.set(username, authorized);
                    resolve(authorized);
                });
            });
        });
    });
};

module.exports = LdapService;