var index = require("../lib/index");
var sinon = require("sinon");
require("should");


describe("Index", function(){
    describe("Configuration", function(){
        it("if configuration not provided, throw exception", function(){
            index.should.throw();
        });
        
        it("if ttl not provided, chose the default value", function(){
            var cache = require("../lib/cache");
            var spy = sinon.spy(cache, "initialize");
            index({});
            spy.calledWith(600).should.be.true();
        });
   }); 
});