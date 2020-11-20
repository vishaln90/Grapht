/**
 * Basic Canvas Paint
 * Copyright (c) 2018 Alex Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.7.3
 */
$(document).ready(function(){

	$.fn.bcPaint1.update_line_status("new");
	$.fn.bcPaint1.get_sample();
	$.fn.bcPaint2.get_sample();
	
	$('#word_text').val("");
	
	$('.outline_on_hover').hover(
               function () {
				  $(this).css("border","1px solid grey");
               }, 
               function () {
				  $(this).css("border","0px");
               }
            );
	
	$('body').on('click', '.frame', function(){

		$(this).siblings().removeClass('selected_frame');
		$(this).addClass('selected_frame');
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".outline_blocks();");
		
		$(this).find(".bcPaintfunctionality").show();
		$(this).siblings().find(".bcPaintfunctionality").hide();
		
		$('.selected_frame').siblings().find('#bcPaint-header').removeClass('selected_header');
		$('.selected_frame').find('#bcPaint-header').addClass('selected_header');
		
		$('.selected_frame').find('#bcPaint-input-div').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-input-div').find('div').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-header').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-header').find('div').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-bottom').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-bottom').find('div').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-menu').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-menu').find('div').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-right').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-right').css("visibility","visible");
		
		$('.selected_frame').find('#type_of_buttons').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#type_of_buttons').find('div').css("visibility","visible");
		
	});
	
	$('body').on('click', '#div_undo', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".undo_function();");
	});
	
	$('body').on('click', '#bcPaint-reset', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".reset_all();");
		$('.selected_frame').find('#word_text').val("");
	});
	

	$('body').on('click', '.content_type', function(){
		$(this).siblings().removeClass('selected_content_type');
		$(this).addClass('selected_content_type');
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".set_content_type();");
	});

	$('body').on('click', '#bcPaint-review', function(){
		if (confirm("Are you sure you want this record to be reviewed")) 
					{
						///Perform action here
					} 
	});
	
	$('body').on('click', '#reset_pending_line_status', function(){
				$.fn.bcPaint1.update_line_status("new");		
		});
		
	$('body').on('click', '#div_complete', function(){
		//alert("Complete clicked");
			$.fn.bcPaint1.get_source_image_path_from_sample();
			$.fn.bcPaint1.insert_into_db();			
		});
});