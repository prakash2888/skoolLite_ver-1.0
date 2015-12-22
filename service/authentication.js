/**
* @author Srinivas Nalla
* Authentication service 
*/
var dbOparations=require("../db.js").dbOparations;
var db=dbOparations.db;

var AuthenticationService=function(){};

AuthenticationService.prototype.findAuthentication=function(obj, callback){
	
	db.collection("schools").findOne(obj,function(err, result){
		if(err){
			return callback(new Error("User not found"));
		}
		
		return callback(null, result);
	});
}

module.exports=new AuthenticationService();

