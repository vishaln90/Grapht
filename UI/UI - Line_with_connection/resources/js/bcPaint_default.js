/**
 * Basic Canvas Paint
 * Copyright (c) 2018 Alex Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.7.3
 */

$(document).ready(function(){
	
	
	
	
	$.fn.bcPaint1.set_grid();
	$.fn.bcPaint1.default_color();
	$.fn.bcPaint1.get_sample();
	
			
	$('body').on('click', '#div_undo', function(){
		$.fn.bcPaint1.undo_function();
	});
	
	
	$('body').on('click', '#update_pending_sample_status', function(){
		$.fn.bcPaint1.update_pending_sample_status();
	});
	
	$('body').on('click', '#reset', function(){
		//alert("click detected");
		$('.content_type').removeClass("selected_content_type");
		$('#div_line').addClass("selected_content_type");
		$.fn.bcPaint1.reset_all();
	});
	
	$('body').on('click', '#review', function(){
		if (confirm("Are you sure you want this record to be reviewed")) 
					{
						///Perform action here
					} 
	});
	
	$('body').on('click', '.content_type', function(){
		//alert("click detected");
		$(this).siblings().removeClass("selected_content_type");
		$(this).addClass("selected_content_type");
		if ($(this).attr('id')=="div_line")
			{$.fn.bcPaint1.default_color();}
		else
			{$.fn.bcPaint1.signature_color();}
	});


$('body').on('click', '#div_complete', function(){
		$.fn.bcPaint1.insert_into_db();
		//$.post('http://localhost:3000/customers/', {email:'abcxx2@abcd.com', name:'abc'});
	});



});



