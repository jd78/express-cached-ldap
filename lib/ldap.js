var cache = require("./cache");
var q = require("q");
var _ = require("underscore");

function LdapService() { 
    var self = this;

    this.initialize = function(activeDirectory, optionalGroups, userToBePartOfAllGroups) {
        self.ad = activeDirectory;
        self.groups = optionalGroups;
        self.userToBePartOfAllGroups = userToBePartOfAllGroups;
        self.initialized = true;
    };

    this.isAuthorized = function(username){
        if(!self.initialized){
            throw new Error("LdapService not initialized, please call initialize first!");
        }
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
                        
                        var authorized = self.userToBePartOfAllGroups === true
                            ? groupIntersection == self.groups.length
                            : groupIntersection > 0;
                        
                        cache.set(username, authorized);
                        resolve(authorized);
                    });
                });
            });
        });
    };
}

module.exports = LdapService;