var ldapService = require("../lib/ldap");
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
    
    it('If unauthorized and no unauthorizedView specified, send 401 status', function(done){
        
        var isAuthorizedStub = sinon.stub(ldapService, "isAuthorized").returns(q.Promise(function(resolve){ resolve(false); }));
        
        var index = require("../lib/index");
        
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
});