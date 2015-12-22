$(function(){
	console.log(" Doc ready >");
});
$("#auth").on("click",function(){
	var username=$("input[name='username']").val();
	var password=$("input[name='password']").val();
	$.ajax({url:"/authentication",type:"POST",data:{"username":username,"password":password},
			success:function(resp){
				console.log(resp);
				if(resp.message==true){
					window.location.href="/admin?_id="+resp._id;
				}else{
					$("#loginF").show();
				}
			}
			});
});
