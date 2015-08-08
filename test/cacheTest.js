var cache = require("../lib/cache");
require("should");

describe("Cachemanager", function(){
    it("Throw expection if cache not instantiated", function(){
        (function(){
            cache.get("test");
        }).should.throw();
        
        (function(){
            cache.remove("test");
        }).should.throw();
        
        (function(){
            cache.set("test", "test");
        }).should.throw();
    });
    
    it("set", function(){
        cache.initialize(600);
        cache.set("test", "test");
    });
    
    it("get", function(){
       cache.get("test").then(function(val){
          val.should.be.exactly("test"); 
       });
    });
    
    it("remove", function(){
       cache.remove("test");
       
       return cache.get("test").then(function(val){
          (val === null).should.be.true();
       });
    });
});