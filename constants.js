var config={

	// File upload path
	baseuploadPath:"uploads",
	studentsUploadDir:"/students",
	parentsUploadDir:"/parents",

	//Search for students using student name results limit
	resultsLimit:5,

	// View page name that will be rendered to web client
	dashboard:"admin",  // dashboard page after login success
	studentRegForm:"studentRegForm",  // student registration form
	studentsList:"studentsList",  // this will show the list of students in table for the dashboard page
	studentInfo:"studentInfo",	 // This will show the studentDetails when searched for student
	makePayment:"studentPayment",		// Payment page for the student.
	feeRegForm:"feeRegForm"		// feeRegForm for the course 
}

module.exports=config;