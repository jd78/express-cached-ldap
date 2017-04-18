var cache = require("./cache");
var q = require("q");
var _ = require("underscore");

function LdapService() { }

LdapService.prototype.initialize = function(activeDirectory, optionalGroups, userToBePartOfAllGroups) {
    this.ad = activeDirectory;
    this.groups = optionalGroups;
    this.userToBePartOfAllGroups = userToBePartOfAllGroups;
    this.initialized = true;
};

LdapService.prototype.isAuthorized = function(username){
    if(!this.initialized){
        throw new Error("LdapService not initialized, please call initialize first!");
    }
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
                    var groupIntersection = _.intersection(_.map(groups, function(g) { return g.cn }), self.groups).length;
                    var authorized = self.userToBePartOfAllGroups 
                        ? groupIntersection == self.groups.length
                        : groupIntersection > 0;
                    cache.set(username, authorized);
                    resolve(authorized);
                });
            });
        });
    });
};

module.exports = new LdapService();