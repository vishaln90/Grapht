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
		//var optionArr = []
//optionArr = {"product": [{"id":1, "name":"abc"}, {"name":"value"}]} 
//var data = optionArr['product'][1]['name']
//alert(data)
	var cars = [];
//alert(cars[1])


$('.button_column').find('div').each(function () {
	var button_class = $(this).attr('class');
	$(this).css("background-image","url('images/e/" + button_class + ".jpg')");
	$(this).css("background-size","100% 100%");
});
$('.lead_buttons').find('div').each(function () {
	var button_class = $(this).attr('class');
	$(this).css("background-image","url('images/lead/" + button_class + ".jpg')");
	$(this).css("background-size","100% 100%");
});
$('.lead2_0').css("background-image","url('images/e/no_lead.jpg')");
$(this).css("background-size","100% 100%");
$('.lead1_0').css("background-image","url('images/e/no_lead.jpg')");
$(this).css("background-size","100% 100%");
	
	//$('.main_e0').css("background-image","url('images/e/main_e0.jpg')");
	//$('.main_e0').css("background-size","100% 100%");
	$('body').on('click', '.frame', function(){
		$(this).siblings().removeClass('selected_frame');
		$(this).addClass('selected_frame');
		
		$(this).find(".bcPaintfunctionality").show();
		$(this).siblings().find(".bcPaintfunctionality").hide();
		
		$('.selected_frame').siblings().find('#bcPaint-header').removeClass('selected_header');
		$('.selected_frame').find('#bcPaint-header').addClass('selected_header');
		
		$('.selected_frame').find('input').css("visibility","visible");
		$(this).siblings().find('input').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-input-div').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-input-div').find('div').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-header').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-bottom').find('div').css("visibility","hidden");
		
			
		$('.selected_frame').find('#bcPaint-bottom').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-bottom').find('div').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-menu').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-menu').find('div').css("visibility","hidden");
		
		$('.selected_frame').find('#bcPaint-right').css("visibility","visible");
		$('.selected_frame').siblings().find('#bcPaint-right').css("visibility","visible");
		
		$('.selected_frame').find('#type_of_buttons').find('div').css("visibility","visible");
		$('.selected_frame').siblings().find('#type_of_buttons').find('div').css("visibility","visible");
		
		$.fn.input_to_button_map();
	});
	
	$('body').on('click', '#div_undo', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".undo_function();");
	});
	
	$('body').on('click', '.bcPaint_palette_color', function(){
		//'#bcPaint-palette'
		$(this).siblings().removeClass('selected_type');
		$(this).addClass('selected_type');
		//alert($(this).attr("id"));
		//$.fn.bcPaint1.setColor($(this).css('background-color'));
	});
	
	
	
	
	$('body').on('click', '.bcPaint_palette_color_subtype', function(){
		$(this).siblings().removeClass('selected_subtype');
		$(this).addClass('selected_subtype');
		//alert($(this).attr("id"));
		//$.fn.bcPaint1.setColor($(this).css('background-color'));
	});
	
	
	$('body').on('click', '#bcPaint-reset', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".clearCanvas();");
	});
	
	$('body').on('click', '#bcPaint-review', function(){
		if (confirm("Are you sure you want this record to be reviewed")) 
					{
						///Perform action here
					} 
	});
	
	$('body').on('click', '.bcPaint-export', function(){
		//var frame1 = $('.selected_frame').attr('id');
		//eval("$.fn." + frame1 + ".export();");	
		cars.pop();
		cars.push("Maruti");
		alert(cars[2]);
	});
	
	$('body').on('click', '.class_buttontype', function(){
		$(this).siblings().removeClass('button-type-selected');
		$(this).addClass('button-type-selected');
		//$.fn.bcPaint1.setColor($(this).css('background-color'));
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
	
	$('body').on('click', '#div_complete', function(){
			var connected_prev = $('.selected_frame').find('#dropdown_previous_letter').val();
			var connected_next = $('.selected_frame').find('#dropdown_next_letter').val();
			if (connected_prev=="not_selected" || connected_next=="not_selected" ) {alert("Please select the values in dropdown");}
				else {
				// Update database for this alphabet and move to new alphabet.
				};			
		});
		
		$('body').on('click', '#div_cancel', function(){
			var letter = prompt("Which letter is this?", "");

			if (letter == null || letter == "") 
			{
				//Nothing
			} else {
				// Update letter field value in database for this alphabet and move to new alphabet.
			}
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
				var button_val = prefix1 + $('.selected_frame').find(id1).val();
				$('#'+button_val).siblings().removeClass('selected_button');
				$('#'+button_val).addClass('selected_button');
            }
});



