var cache = require("./cache");
var utils = require("./utils");
var ldapService = require("./ldap");
var ActiveDirectory = require("activedirectory");

var defaults = {
    ttl: 1800,
    cacheCheckPeriod: 600
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
        
    cache.initialize(utils.coalesce(options.ttl, defaults.ttl), utils.coalesce(options.cacheCheckPeriod, defaults.cacheCheckPeriod));
    
    var strictGroup = options.userToBePartOfAllGroups === undefined ? true : options.userToBePartOfAllGroups;

    var l = new ldapService();
    l.initialize(new ActiveDirectory(
        { url: options.ldapUrl,
          baseDN: options.baseDN,
          username: options.ldapUsername,
          password: options.ldapPassword }), options.groups, strictGroup);

    function check(req, res, next){
        if(req.connection === undefined || req.connection.ntlm === undefined)
            throw new Error("The request does not contain NTLM info. Please install express-ntlm first and include it as express middleware");
            
        l
        .isAuthorized(req.connection.ntlm.UserName)
        .then(function(result) {
            isAuthorized = result.isAuthorized;
            groupMemberships = result.groupMemberships;
            req.ntlm.groupMemberships = groupMemberships;
            if(!isAuthorized){
                if(!options.unauthorizedView)
                    return res.sendStatus(401);
                else 
                    return res.render(options.unauthorizedView);
            }
            next();
        })
        .catch(function(err) {
            return res.send(err);
        });;
    };
    check.groups = options.groups;
    return check;
};