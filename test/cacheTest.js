var cache = require("../lib/cache");
require("should");

describe("Cachemanager", function(){
    it("Throw expection if cache not instantiated", function(){
        var exceptions = 0;
        try {
            cache.get("test");
        } catch(ex){
            exceptions++;
        }
        
        try {
            cache.remove("test");
        } catch(ex){
            exceptions++;
        }
        
        try {
            cache.set("test", "test");
        } catch(ex){
            exceptions++;
        }
        
        exceptions.should.be.exactly(3);
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
       
       cache.get("test").then(function(val){
          (val === null).should.be.exactly(true); 
       });
    });
});