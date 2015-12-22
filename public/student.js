var datePicker=null;
$(function () 
{
	
	// intializing pop up .
	$("#studentLi").addClass("active");
	datePicker=$('#dueDate').datetimepicker({format: 'DD-MM-YYYY'});
	$('#dob').datetimepicker({format: 'DD-MM-YYYY'});
	datePicker.on("dp.change",function(){
    	var feeInterval=$("#feeInterval :selected").val();
    	$("#pop").hide('slow');
		if(feeInterval.length!=0){
			var interval=Number(feeInterval);
			var feeTerms=calculateDueDates(Number(interval),$(this).val());
			console.log(feeTerms);
			showDueDates(feeTerms);
		}
    });



    // Calculation FeeInterval based on the date
   $("#feeInterval").on("change",function(){
   
   	var feeInterval=$(this).val();
   	var currentDate=$("#dueDate").val();
   	if(feeInterval.length!=0 && currentDate.length!=0){
	$("#pop").hide('slow');
			var interval=Number(feeInterval);
			var feeTerms=calculateDueDates(Number(interval),currentDate);
			console.log(feeTerms);
			showDueDates(feeTerms);
   	}
   
   });

   //Save the student object on submit
   $("#saveStudent").on("click", saveStudent);
   $("#showFeeRegForm").on("click",showFeeRegForm);
	
});



function Validate(elem){
   
    /* properties */
    this.elem=elem;
   
    /* functions for validations */
    this.require=function(){
        var flag=true;
       
        $(this.elem).each(function() {
       // console.log(this);
        //console.log(this.type);   
        if(this.type=='text' || this.type=='number' || this.type=='date' || this.type=='textarea' || this.type=='select-one'){
            if ($(this).val().length == 0 )
            {
                flag=false;
                $(this).addClass('error');

            }else{
                $(this).removeClass('error');
            }
        }else if(this.type=="radio" || this.type=="checkbox"){
            // checkbox || radio
            var name=this.name;
           // console.log(name);
            isCheck=$('input[name='+name+']').is(':checked');
            console.log("is check :"+isCheck);
            if(isCheck){
                //$(this).removeClass('error');

                $("#"+name+"Error").hide();
            }else{
               // $(this).addClass('error');
                $("#"+name+"Error").show(500);

                flag=false;
            }
           
        }   
           
        });
       
        return flag;
    };

}

$(".numberOnly").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        $("#phoneError").html("Digits Only").show().fadeOut("slow");
               return false;
    }
   });

var calculateDueDates=function(interval,currentDate){
	var feeTerms=[];
	
	feeTerms.push(moment(currentDate,"DD-MM-YYYY").format('DD-MMM-YYYY'));
		for(var i=1; i<interval; i++){			
			var endDateMoment = moment(currentDate,"DD-MM-YYYY"); 
			endDateMoment.add(i*(12/interval), 'months');
			feeTerms.push(endDateMoment.format('DD-MMM-YYYY'));
		}
		
		return feeTerms;
	
}

var showDueDates=function(intervals){
	var content="";
	intervals.forEach(function(d){
		content=content+d+"<br>";
	});
	var paymentDates=intervals.join(',');
			console.log(paymentDates);
			$("input[name='paymentDates']").val(paymentDates);
	$('.popover-content').html(content);
	$("#pop").show('slow');
}

var verifyStudent=function(){
	var rollNo=$("#rollNo :selected").val();
	console.log(rollNo);
	var studentClass=$("#classLevel :selected").val();
	console.log(studentClass);

	if(rollNo.length!=0 && studentClass.length!=0){
		// make ajax for student verification
		$("#saveStudent").prop("disabled",true);
		$.ajax({
			type:"post",
			data:"rollNo="+rollNo+"&classLevel="+studentClass,
			url:"/admin/verifyStudent",
			success:function(resp){
				if(resp.message){
					//$("#rollNoError").html("");
					$("#saveStudent").prop("disabled",false);
				}else{
					//$("#rollNoError").html("This rollNo already assinged");								
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	}

};

/* Saving student from ajax submit */
var showFeeRegForm=function(){
	$("#feeRegInfo").modal('hide');
	 console.log("====");
    var classLevel=$("#classLevel :selected").val();
	$.ajax({
		type:"GET",
		url:"/admin/feeRegForm/"+classLevel,
		success:function(resp){

		$("#regFrom-body").html(resp);

		$("#regFrom").modal('show');
		
		}
	});	
}

var saveStudent=function(){
var isValid=new Validate(".required").require();
	console.log("saving form");
	console.log(isValid)
	if(isValid){
		var formData=$("#studentForm").serialize();
		console.log(formData);

		// checking Fee Registration for the coures in the school.
		var classLevel=$("#classLevel :selected").val();
		$.ajax({
			type:"GET",
			url:"/admin/courseFeeDetails/"+classLevel,
			success:function(resp){
				if(resp.status){
					console.log(resp)
					$("#feeRegInfo").modal('hide');
					console.log(resp.result);
					//var data=resp.result.course[classLevel];
					var studentFee;
					resp.result.forEach(function(d){
						if(d.course==classLevel){
							studentFee=d;
						}
					});
					var fees=[];
					var name=this.name;
           // console.log(name);
           			//seting up annualFee and student feeObject;
           			var annualFee=0;
           			$('.feeType').each(function(){
           				var name=this.name;
           				 isCheck=$(this).is(':checked');
           				 console.log("=="+this.name)
           			 console.log("is check :"+isCheck);
           			 if(isCheck){
           			 	fees.push(this.value);
           			 	
           			 }
           			});
           		 	
					if(fees.length==0)
						return false;
					console.log(fees);
					var feeObject={};
					fees.forEach(function(d){
						feeObject[d]=studentFee[d];
						console.log("************");
						console.log(feeObject[d]);
						annualFee=Number(feeObject[d])+annualFee;
					})
					feeObject.annualFee=annualFee;
					console.log(feeObject);
					//feeObject.annualFee=annualFee;
					// annual Fee:
					//return false;
					console.log("fee Object :");
					//return false;
					$.ajax({
						type:"POST",
						url:"/admin/submitStudent",
						data:formData,
						success:function(resp){
							console.log(resp);
							var feeInfo={};

							addToLog(resp.result[0],feeObject);
							resetForm();
						}
					});
				}else{
					//show the fee reg info form
					$("#feeRegInfo").modal('show');
					var span="<span class='text-danger'>"+resp.err+"</span>"
					$("#feeRegInfo-body").html(span);
				}
			}
		})
		/**/
				
	}// Valid Function end block
}
   
var resetForm=function(){
	$("#reset").click();
	$('#dueDate').popover('hide');
	datePicker.data("DateTimePicker").clear();
}

var addToLog=function(obj,studentFee){
	var regStudent='<div class="alert alert-info alertStudent " style="display:none; cursor:pointer" id="s'+
						obj.sec_code+'" onclick="makePayment(&apos;'+obj._id+'&apos;)">Student Name : '+
						obj.studentName+' , Section : '+obj.section+' , Class : '+
						obj.classLevel+' , Student Code : <strong>'+obj.sec_code+'</strong>'+
						' <a href="#"><b>Pay</b></a></div>';
	$("#todayRegister").prepend(regStudent);
	$("#s"+obj.sec_code).show('slow');
	$('.popover-content').html("");
	$("#pop").hide('slow');

	updateFeeInfo(obj._id,studentFee);

}

var updateFeeInfo=function(studentId,studentFee){
	studentFee.student_id=studentId
	console.log(studentFee);
	$.ajax({
		type:"POST",
		url:"/admin/addStudentFeeInfo",
		data:studentFee,
		success:function(resp){
			console.log(resp);
		},error:function(ex){
			alert("Error while adding..Student Fee");
		}

	})
}

