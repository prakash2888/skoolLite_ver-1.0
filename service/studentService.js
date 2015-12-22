/**
* @author : Nalla Srinivas
* StudentService.js
* 
*/
var dbOparations=require("../db.js").dbOparations;
var config=require('../constants.js');
var ObjectID = require('mongodb').ObjectID;   //unique Id generator.
var db=dbOparations.db;
var StudentService=function(){};

/* functions for StudentService class */

StudentService.prototype.registerStudent = function(obj,callback) {
	// Generate Unique code for the student.
	console.log("inside of registerStudent")

	db.collection("students").count({school_id:obj.school_id},
		function(err,count){
		console.log("Max record "+count)  //Max id for the student
		var encStr=(count+1)+obj.section+obj.classLevel;

		obj.sec_code=encStr+obj.school_code;
		console.log("Student code :"+obj.sec_code)

		//setting parent Obj;
		obj.parents=[];
		obj.payments=[];
		db.collection("students").insert(obj,function(err,result){

		if(err){
			console.log("Error :");
			return callback(new Error("Data base excetpion"));
		}
		return callback(null,result);
		});		
	})
};


// checking student existance using rollno and class level
StudentService.prototype.isStudentExists=function(obj,callback){
	
	db.collection("students").findOne(obj,{_id:0,rollNo:1,studentName:1},function(err, result){
		if(err){
			return callback(new Error("Data base excetpion"));
		}

		if(result==null){
			return callback(null, null);
		}
		return callback(null,result);

	});
}

// find reigistred students by date
StudentService.prototype.findStudentsByDate=function(obj,callback){
	
	db.collection("students").find(obj).sort({_id:-1}).toArray(function(err,result){
		
		if(err){
			return callback(new Error("Data base excetpion"));
		}

		return callback(null,result);

	});
}

StudentService.prototype.listStudents=function(obj, callback){

	db.collection("students").find(obj).toArray(function(err,result){
		console.log("Students size :"+result.length)
		if(err){
			return callback(err);
		}

		return callback(null, result);
	})
}

StudentService.prototype.verifyStudent=function(obj,callback){
	db.collection("students").findOne(obj,function(err,result){
		if(err){
			return callback(new Error("DataBase Excetpion"));
		}

		return callback(null, result);

	})
}

// This method updates the student details
StudentService.prototype.updateSudentDetails=function(query,data,callback){
	var qry={_id:dbOparations.helper.toObjectID(query._id)}
	//console.log(JSON.stringify(qry))
	db.collection("students").update(qry,{'$set':data},function(err,result){
		if(err){
			return callback(new Error("DataBase Excetpion"));
		}

		return callback(null,result);
	})
}

// query=(db.students.find({studentName:{$regex:/ar/i}}).pretty();)
// data:'searchStr'
StudentService.prototype.searchStudent=function(data,callback){
	//console.log(data.data);
	var query={studentName:{$regex:new RegExp(data.studentName, 'ig')}};
	query.school_id=data.school_id;
	console.log(query);
	db.collection("students").find(query).limit(config.resultsLimit).toArray(function(err,result){
		if(err){
			return callback(new Error("Db excetpion"));
		}
		//console.log(JSON.stringify(result));
		return callback(null, result);
	});
}

//Add the parent object to student
StudentService.prototype.addParent=function(query,parent,callback){
	console.log("Adding parent :"+query)
	var qry={_id:dbOparations.helper.toObjectID(query)};
	// adding unique id to parent Object
	parent.parent_id=new ObjectID;
	db.collection("students").update(qry,{$push:{parents:parent}},function(err,result){
		if(err){
			return callback(err);
		}
		return callback(null,result);
	});
}

// This method will find student using _id Field.
// query: {_id:12569884445521233}
StudentService.prototype.findStudentById=function(query,callback){
	console.log("findStudentById :"+query);
	var qry={_id:dbOparations.helper.toObjectID(query)};
	db.collection("students").findOne(qry,function(err,result){
		if(err){
			return callback(err);
		}
		
			console.log("else");
			return callback(null,result);
	})
}

//{studentId:studentId,paymentAmount:payment,paymentMode:paymentMode,paidBy:paidBy,notify:notify,
// amountPaid:amountPaid}
StudentService.prototype.savePayment=function(data,callback){

	var criteria={_id:dbOparations.helper.toObjectID(data.studentId)};
	delete data['studentId'];
	var paymentId=new ObjectID;
	data.paymentId=paymentId;
	console.log(JSON.stringify(criteria))
	console.log(JSON.stringify(data));
	var amountPaid=data.amountPaid;
	var notify=data.notify;

	delete data['notify'];
	delete data['amountPaid'];
	db.collection("students").update(criteria,{$push:{payments:data},$set:{amountPaid:amountPaid,
		notify:notify}},function(err,result){
			if(err){
				return callback(new Error("DataBase Error"));
			}else{
			return callback(null,result);	
			}
			
	});
}

// @param query
//        {course:'',_id:school_id} 
StudentService.prototype.courseFeeDetails=function(query,callback){
	console.log(query);
	query._id=dbOparations.helper.toObjectID(query._id);
	db.collection("schools").findOne(query,function(err,result){
		return callback(err,result);
	});
}

// this method updates the school fee details for the course
StudentService.prototype.updateFeeInfo=function(query,school_id,callback){
	var criteria={_id:dbOparations.helper.toObjectID(school_id)};
	db.collection("schools").update(criteria,{$push:{courseFee:query}},function(err,result){
		if(err){
			return callback(err);
		}
		return callback(null,result);
	});
};

StudentService.prototype.addStudentFeeInfo=function(data,_id,callback){
	var criteria={_id:dbOparations.helper.toObjectID(_id)};
	console.log(data);
	console.log(criteria);
	db.collection("students").update(criteria,{$set:{studentFee:data,annualFee:data.annualFee}},function(err,result){
		if(err){
			return callback(err);
		}
		return callback(null,result);
	});
}
module.exports=new StudentService();
