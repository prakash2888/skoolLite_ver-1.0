var makePayment=function(studentId){
	$.ajax({
		type:"GET",
		url:"/admin/makePaymentForStudent/"+studentId,
		success:function(resp){
			$("#makePayment-body").html(resp);
			$("#makePayment").modal('show');
		},
		error:function(ex){

		}
	})
}

var submitPayment=function(){
	console.log("pay click")
	
	var payment=$("#payment").val();
	if(payment.length==0){
		$("#payment").addClass('error');
		return false;
	}else{
		//console.log("payment amount:"+$("#payment").val())
		$("#payment").removeClass('error');
	}

	var paymentMode=$("#paymentMode").val();
	//console.log(paymentMode)
	if(paymentMode=='other'){
		paymentMode=$("#otherPay").val();
		if(paymentMode.length==0){
			$("#otherPay").addClass("error");
			return false;
		}else{
			$("#otherPay").removeClass("error")
		}
	}

	var paidBy=$("#paidBy").val();
	//console.log(paidBy);
	if(paidBy.length==0){
		$("#paidBy").addClass('error');
		return false;
	}else{
		$("#paidBy").removeClass('error');
	}

	if(paidBy=="otherParent"){
		paidBy=$("#other").val();
		if(paidBy.length==0){
			$("#other").addClass('error');
			return false;
		}else{
			$("#other").removeClass('error');
		}
	}

	var notify=$("input[name=notify]:checked").val();
	$(this).hide();
	$("#spinner").show();
	console.log(payment);
	console.log(paymentMode);
	console.log(paidBy);
	console.log(notify);
	//$(this).show();
	//$("#spinner").hide();
	var studentId=$("#studentId").val();
	var studentName=$("#studentName").val();
	var amountPaid=$("#amountPaid").val();
	paymentAmount=Number(amountPaid)+Number(payment);
	var paymentData={paymentAmount:payment,paymentMode:paymentMode,paidBy:paidBy,notify:notify,
		amountPaid:paymentAmount}
	paymentData.studentId=studentId;
	$.ajax({
		type:"POST",
		url:"/admin/savePayment",
		data:paymentData,
		success:function(resp){
			bootbox.alert("<span class='text-success'> <b>Payment Done for the Student :"
				+studentName+"</b></span>",function(){
				//$("#makePayment").modal('hide');
				window.location.reload();

			});
		},
		error:function(ex){
			bootbox.alert("<span class='text-danger'> <b>Payment Failed for the Student :"
				+studentName+"</b></span>");
		}
	})
}

