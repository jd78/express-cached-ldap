var ActiveDirectory = require("activedirectory");
var cache = require("../lib/cache");
var LdapService = require("../lib/ldap");
var sinon = require("sinon");
var q = require("q");
require("should");


describe("LdapService", function(){
    
    var getCacheStub;
    var setCacheStub;
    
    var ad = new ActiveDirectory(
        { url: 'ldap://test.test.com',
          baseDN: 'dc=test,dc=com',
          username: 'user',
          password: 'pwd' });
    
    beforeEach(function(){
        getCacheStub = sinon.stub(cache, "get");
        setCacheStub = sinon.stub(cache, "set");
    });
    
    afterEach(function(){
        getCacheStub.restore();
        setCacheStub.restore();
    });
    
    var returnUser = {
        dn: 'CN=Surname\\, Name,OU=Group 1,OU=Group 2, OU=Group3, DC=test,DC=com'
    };
    
    it("if the user isn't in cache, cache it afrer the find", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
         var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
             callback(null, returnUser);
         });
        
        return new LdapService(ad).isAuthorized("test").then(function(){
            setCacheStub.withArgs("test", returnUser).calledOnce.should.be.true();
            
            findUserStub.restore();
        });
    });
})