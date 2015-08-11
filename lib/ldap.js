var cache = require("./cache");
var q = require("q");
var _ = require("underscore");
var util = require("util");


function LdapService(activeDirectory, optionalGroups){
    this.ad = activeDirectory;
    this.groups = optionalGroups !== undefined 
    ? _.reduce(optionalGroups.split(','), function(memo, group){ 
        return memo.concat(util.format("OU=%s", group));
    }, []) 
    : undefined;
    
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
                
                var groups = user.dn.split(',');
                var authorized = _.intersection(groups, self.groups).length == self.groups.length;
                cache.set(username, authorized);
                resolve(authorized);
            });
        });
    });
};

module.exports = LdapService;


