/**
* @author : Nalla Srinivas
* File : api.js
*/

var express=require("express");
var router=express.Router();


// application required files 
var studentService=require('../service/StudentService.js')
var authenticationService=require('../service/authentication.js')
var config=require('../constants.js')

// Uploading file locations for student photos and parent photos
var multer=require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './'+config.baseuploadPath+config.studentsUploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var storageParent = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './'+config.baseuploadPath+config.parentsUploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var studentUpload = multer({ storage: storage }) // students photo uploads location.
var parentUpload=multer({storage:storageParent}) // parents photo uploads location.

// application Required controllers starts from here.

/**
* URL: http://localhost:3000/api/verifyStudent/studentcode
* METHOD: GET
* Here, studentcode is the request param.
* this url verify the student against db and returns student data as response.
*/
router.get('/verifyStudent/:studentcode',function(req,resp, next){
	var query={sec_code:req.params.studentcode};
	console.log(query);
	studentService.verifyStudent(query,function(err,result){
		if(err){
			resp.json({status:"failed",message:"Internal server error"});
		}

		if(result==null){
			resp.json({status:"failed",message:"Invalid student code"});
		}else{
			resp.json({status:"success",result:result});
		}
	})
});

// Uploading student photo.
/**
* URL: http://localhost:3000/api/uploadStudentPhoto
* METHOD: POST
* @param: studentPhoto
*	 It should be the file to be uploaded.
*	 studentPhoto file name should be combination of student_id,timestamp,
*	 and school_id
*	  Ex: (student_id)+(timestamp)+(school_id).jpg 
* @param: student_id 
* 	It should be the unique student id.
*		
*/
router.post('/uploadStudentPhoto',studentUpload.single('studentPhoto'),function(req,resp,next){

	console.log(req.body.student_id);
	var query={_id:req.body.student_id};

	var storeData={};
	storeData.photoPath=config.studentsUploadDir+"/"+req.file.filename;
	//storeData.gcm_id=req.body.gcm_id;
	
	studentService.updateSudentDetails(query,storeData,function(err,result){
		if(err){
			resp.json({status:"failed",err:err});
		}
		console.log(JSON.stringify(result))
		resp.json({status:"success"});
	});	
});


/**
* URL: http://localhost:3000/api/uploadParentDetails
* METHOD: POST
* @param: parentPhoto
*			It is the file to be uploaded.
*			filename = student_id+randomNumber+timestamp.jpg
*				Here, random number between 1-10000
* @param: student_id
*			It is the unique student id
* @param: gcm_id
*		  Device GCM id
* @param: parent_name:
*			firstname+lastname of the parent.
* @param: parent_phone:
*			phone no
* @param: parent_relation
* @param: parent_gender
* @param: parent_address
*			
*/
router.post('/uploadParentDetails',parentUpload.single('parentPhoto'),function(req,resp,next){
	// req.body.
	var query=req.body.student_id;

	var parentObject={};
	parentObject.parent_name=req.body.parent_name;
	parentObject.parent_phone=req.body.parent_phone;
	parentObject.parent_gender=req.body.parent_gender;
	parentObject.parent_relation=req.body.parent_relation;
	parentObject.parent_address=req.body.parent_address;
	parentObject.parent_photo_path=config.parentsUploadDir+"/"+req.file.filename;
	parentObject.gcm_id=req.body.gcm_id;

	studentService.addParent(query,parentObject,function(err,result){
		if(err){
			resp.json({status:"failed"});
		}

		resp.json({status:"success"});
	});

});

router.get("/findStudent/:_id",function(req, resp,next){
	studentService.findStudentById(req.params._id,function(err,result){
		if(err){
			resp.json({status:"failed",err:err});
		}
		if(result==null)
			resp.json({status:"failed",err:"user not found"})
		else
			resp.json({status:"success",result:result});
	});
});
module.exports=router;