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
	
	
	
	
	$('body').on('click', '#bcPaint-reset1', function(){
		$.fn.bcPaint1.clearCanvas();
	});
	$('body').on('click', '#bcPaint-reset2', function(){
		$.fn.bcPaint2.clearCanvas();
	});
	$('body').on('click', '#bcPaint-reset3', function(){
		$.fn.bcPaint3.clearCanvas();
	});
	$('body').on('click', '#bcPaint-reset4', function(){
		$.fn.bcPaint4.clearCanvas();
	});
	
	
	
	$('body').on('click', '#bcPaint-export1', function(){
		$.fn.bcPaint1.export();
	});
	$('body').on('click', '#bcPaint-export2', function(){
		$.fn.bcPaint2.export();
	});
	$('body').on('click', '#bcPaint-export3', function(){
		$.fn.bcPaint2.export();
	});
	$('body').on('click', '#bcPaint-export4', function(){
		$.fn.bcPaint2.export();
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
				var input_value_lead1 = 'lead1_'+$('.selected_frame').find('#input_type_lead1').val();
				$('#'+input_value_lead1).siblings().removeClass('selected_button');
				$('#'+input_value_lead1).addClass('selected_button');
				var input_value_lead2 = 'lead2_'+$('.selected_frame').find('#input_type_lead2').val();
				$('#'+input_value_lead2).siblings().removeClass('selected_button');
				$('#'+input_value_lead2).addClass('selected_button');
				var input_value_start = 'start_'+$('.selected_frame').find('#input_type_start').val();
				$('#'+input_value_start).siblings().removeClass('selected_button');
				$('#'+input_value_start).addClass('selected_button');
				var input_value_main = 'main_'+$('.selected_frame').find('#input_type_main').val();
				$('#'+input_value_main).siblings().removeClass('selected_button');
				$('#'+input_value_main).addClass('selected_button');
				var input_value_end = 'end_'+$('.selected_frame').find('#input_type_end').val();
				$('#'+input_value_end).siblings().removeClass('selected_button');
				$('#'+input_value_end).addClass('selected_button');
				var input_value_trail = 'trail_'+$('.selected_frame').find('#input_type_trail').val();
				$('#'+input_value_trail).siblings().removeClass('selected_button');
				$('#'+input_value_trail).addClass('selected_button');
            } 
			
});



