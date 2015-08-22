var ldapService = require("../lib/ldap");
var index = require("../lib/index");
var q = require("q");
var sinon = require("sinon");
require("should");

describe('Middleware', function(){
    
    var config = {
        ldapUrl: 'ldap://test.domain.com',
        baseDN: 'dc=domain,dc=com',
        ldapUsername: 'test',
        ldapPassword: 'test'
    };
    
    it('If authorized, call next middleware', function(done){
        
        var isAuthorizedStub = sinon.stub(ldapService, "isAuthorized").returns(q.Promise(function(resolve){ resolve(true); }));
        
        var res = {
            sendStatus: function(p){ }
        };
        
        var next = sinon.spy();
        var resSpy = sinon.spy(res, "sendStatus");
        
        var middleware = index(config);
        middleware({
            connection: {
                ntlm: {}
            }
        }, res, next);
        
        setTimeout(function(){
            next.called.should.be.true();
            resSpy.called.should.be.false();
            isAuthorizedStub.restore();
            done();
        }, 50);
    });
    
    it('If unauthorized and no unauthorizedView specified, send 401 status', function(done){
        
        var isAuthorizedStub = sinon.stub(ldapService, "isAuthorized").returns(q.Promise(function(resolve){ resolve(false); }));
        
        var res = {
            sendStatus: function(p){ }
        };
        
        var next = sinon.spy();
        var resSpy = sinon.spy(res, "sendStatus");
        
        var middleware = index(config);
        middleware({
            connection: {
                ntlm: {}
            }
        }, res, next);
        
        setTimeout(function(){
            next.called.should.be.false();
            resSpy.calledWith(401).should.be.true();
            isAuthorizedStub.restore();
            done();
        }, 50);
    });
    
    it('If unauthorized and unauthorizedView specified, render the specified unauthorizedView', function(done){
        
        var isAuthorizedStub = sinon.stub(ldapService, "isAuthorized").returns(q.Promise(function(resolve){ resolve(false); }));
        
        var configUnauthorizedView = {
            ldapUrl: 'ldap://test.domain.com',
            baseDN: 'dc=domain,dc=com',
            ldapUsername: 'test',
            ldapPassword: 'test',
            unauthorizedView: 'unauthorized'
        };
        
        var res = {
            render: function(p){}
        };
        
        var next = sinon.spy();
        var resSpy = sinon.spy(res, "render");
        
        var middleware = index(configUnauthorizedView);
        middleware({
            connection: {
                ntlm: {}
            }
        }, res, next);
        
        setTimeout(function(){
            next.called.should.be.false();
            resSpy.calledWith(configUnauthorizedView.unauthorizedView).should.be.true();
            isAuthorizedStub.restore();
            done();
        }, 50);
    });
});