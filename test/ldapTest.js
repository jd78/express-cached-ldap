var ActiveDirectory = require("activedirectory");
var cache = require("../lib/cache");
var ldapService = require("../lib/ldap");
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
        dn: 'CN=Surname\\, Name,OU=Group 1,OU=Group 2,OU=Group 3,DC=test,DC=com'
    };
    
    it("if the user isn't in cache, cache it afrer the find", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, returnUser);
        });
        
        ldapService.initialize(ad);
        return ldapService.isAuthorized("test").then(function(){
            setCacheStub.withArgs("test", true).calledOnce.should.be.true();
            
            findUserStub.restore();
        });
    });
    
    it("if the user is in cache, return the cached auth without calling the find", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(returnUser); }));
        var findUserStub = sinon.stub(ad, "findUser");
        
        ldapService.initialize(ad);
        return ldapService.isAuthorized("test").then(function(){
            setCacheStub.called.should.be.false();
            findUserStub.called.should.be.false();
            
            findUserStub.restore();
        });
    });
    
    it("if user not found, user is not authorized", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, undefined);
        });
        
        ldapService.initialize(ad);
        return ldapService.isAuthorized("test").then(function(isAuthorized){
            setCacheStub.withArgs("test", false).calledOnce.should.be.true();
            isAuthorized.should.be.false();
            findUserStub.restore();
        });
    });
    
    it("if user found, user is authorized", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, returnUser);
        });
        
        ldapService.initialize(ad);
        return ldapService.isAuthorized("test").then(function(isAuthorized){
            setCacheStub.withArgs("test", true).calledOnce.should.be.true();
            isAuthorized.should.be.true();
            findUserStub.restore();
        });
    });
    
    it("if user is not in the given group, user is not authorized", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, returnUser);
        });
        
        var findGroupsStub = sinon.stub(ad, "getGroupMembershipForUser", function(user, callback){
            callback(undefined, [{cn: "Group 1"}]);
        });
        
        ldapService.initialize(ad, ["Group 4"], true);
        return ldapService.isAuthorized("test").then(function(isAuthorized){
            setCacheStub.withArgs("test", false).calledOnce.should.be.true();
            isAuthorized.should.be.false();
            findUserStub.restore();
            findGroupsStub.restore();
        });
    });
    
    it("if user is in the given group, user is authorized", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, returnUser);
        });
        
        var findGroupsStub = sinon.stub(ad, "getGroupMembershipForUser", function(user, callback){
            callback(undefined, [{cn: "Group 1"}, {cn: "Group 3"}]);
        });
        
        ldapService.initialize(ad, ["Group 3"], true);
        return ldapService.isAuthorized("test").then(function(isAuthorized){
            setCacheStub.withArgs("test", true).calledOnce.should.be.true();
            isAuthorized.should.be.true();
            findUserStub.restore();
            findGroupsStub.restore();
        });
    });
    
    it("if user is in the given groups, user is authorized", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, returnUser);
        });
        
        var findGroupsStub = sinon.stub(ad, "getGroupMembershipForUser", function(user, callback){
            callback(undefined, [{cn: "Group 1"}, {cn: "Group 3"}, {cn: "Group 4"}]);
        });
        
        ldapService.initialize(ad, ["Group 1", "Group 3"], true);
        return ldapService.isAuthorized("test").then(function(isAuthorized){
            setCacheStub.withArgs("test", true).calledOnce.should.be.true();
            isAuthorized.should.be.true();
            findUserStub.restore();
            findGroupsStub.restore();
        });
    });
    
    it("userToBePartOfAllGroups=true - if user is not in the given groups, user is not authorized", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, returnUser);
        });
        
        var findGroupsStub = sinon.stub(ad, "getGroupMembershipForUser", function(user, callback){
            callback(undefined, [{cn: "Group 1"}, {cn: "Group 3"}]);
        });
        
        ldapService.initialize(ad, ["Group 1" ,"Group 4"], true);
        return ldapService.isAuthorized("test").then(function(isAuthorized){
            setCacheStub.withArgs("test", false).calledOnce.should.be.true();
            isAuthorized.should.be.false();
            findUserStub.restore();
            findGroupsStub.restore();
        });
    });

    it("userToBePartOfAllGroups=false - if user is not in all group but in one or more, user is authorized", function(){
        getCacheStub.returns(q.promise(function(resolve){ resolve(null); }));
        var findUserStub = sinon.stub(ad, "findUser", function(user, callback){
            callback(undefined, returnUser);
        });
        
        var findGroupsStub = sinon.stub(ad, "getGroupMembershipForUser", function(user, callback){
            callback(undefined, [{cn: "Group 1"}, {cn: "Group 3"}]);
        });
        
        ldapService.initialize(ad, ["Group 1" ,"Group 4"], false);
        return ldapService.isAuthorized("test").then(function(isAuthorized){
            setCacheStub.withArgs("test", false).calledOnce.should.be.true();
            isAuthorized.should.be.true();
            findUserStub.restore();
            findGroupsStub.restore();
        });
    });
});