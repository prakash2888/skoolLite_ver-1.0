
var express = require('express');
var router = express.Router();


/* application required services imports starts form here */
var authenticationService=require("../service/authentication.js");

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* authentication verification */

router.post("/authentication",function(req,resp,next){
	
	authenticationService.findAuthentication({username:req.body.username,password:req.body.password},
			function(err,result){
				console.log(JSON.stringify(err));
				console.log(JSON.stringify(result));
				if(err){
					resp.json({message:"error",err:err});
				}
				if(result==null){
				 	resp.json({message:false,err:"user not found"});	
				}else{
					req.session.school=result;
					resp.json({message:true,_id:result._id});	
				}
				
			});


});

/* school Registration page */

module.exports = router;
