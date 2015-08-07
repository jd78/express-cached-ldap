var cache = require("./lib/cache");

cache.instantiate(600);
cache.set("test", "test");
cache.get("test").then(function(test){
    console.log(test);
});
