var ActiveDirectory = require("activedirectory");
var cache = require("./cache");


function LdapService(){
    this.ad;
}

LdapService.prototype.initialize = function(configuration){
    this.ad = new ActiveDirectory({
        url: configuration.ldapUrl,
        baseDN: configuration.baseDN,
        username: configuration.ldapUsername,
        password: configuration.ldapPassword
    });
};

module.exports = new LdapService();


