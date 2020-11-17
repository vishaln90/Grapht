/**
 * Basic Canvas Paint
 * Copyright (c) 2018 Alex Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.7.3
 */

$(document).ready(function(){
	
	
	var cw = $('.button_column').find("div").width();
	$('.button_column').find("div").css({'height':cw+'px'});
	
	
	$('body').on('click', '.frame', function(){
		$(this).siblings().removeClass('selected_frame');
		$(this).addClass('selected_frame');
		
		$(this).find(".bcPaintfunctionality").show();
		$(this).siblings().find(".bcPaintfunctionality").hide();
		$('.selected_frame').find('input').css("visibility","visible");
		$(this).siblings().find('input').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-right').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-right').css("visibility","visible");
		
		$.fn.input_to_button_map();
	});
	
		
	$('body').on('click', '#bcPaint-palette-color1', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint1.setColor($(this).css('background-color'));
	});
	$('body').on('click', '#bcPaint-palette-color2', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint2.setColor($(this).css('background-color'));
	});
	$('body').on('click', '#bcPaint-palette-color3', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint3.setColor($(this).css('background-color'));
	});
	$('body').on('click', '#bcPaint-palette-color4', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint4.setColor($(this).css('background-color'));
	});
	
	$('body').on('click', '.bcPaint-reset', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".clearCanvas();");
	});
	
	$('body').on('click', '.bcPaint-export', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".export();");	
	});

	
	$('.button_column').on('click', 'div', function(){
		$(this).parent().find('.selected_button').removeClass('selected_button');
		$(this).addClass('selected_button');
		var button_id = $(this).attr('id');
		button_id=button_id.replace('lead1_','').replace('lead2_','').replace('start_','').replace('main_','').replace('end_','').replace('trail_','')
		var button_col_identifier = $(this).parent().attr('id');
		var input_type_identifier='#input_type_'+button_col_identifier.replace('button_col_','');
		$('.selected_frame').find(input_type_identifier).val(button_id);
	});
	
	$.fn.input_to_button_map = function() {  
				$.fn.input_to_button_process('lead1_','#input_type_lead1');
				$.fn.input_to_button_process('lead2_','#input_type_lead2');
				$.fn.input_to_button_process('start_','#input_type_start');
				$.fn.input_to_button_process('main_','#input_type_main');
				$.fn.input_to_button_process('end_','#input_type_end');
				$.fn.input_to_button_process('trail_','#input_type_trail');
            } 
			
	$.fn.input_to_button_process = function(prefix1,id1) {  
				var button_val = prefix1+$('.selected_frame').find(id1).val();
				$('#'+button_val).siblings().removeClass('selected_button');
				$('#'+button_val).addClass('selected_button');
            }
			
			
});



