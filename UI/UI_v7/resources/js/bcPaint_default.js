/**
 * Basic Canvas Paint
 * Copyright (c) 2018 Alex Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.7.3
 */

$(document).ready(function(){

	var inp_char= get_parameter_from_url('character_value', window.location.href);
	var palette_button_html="";
	if (inp_char == null) {inp_char = $('#character_value').text();} 
	$('#character_value').text(inp_char);
	
	$.fn.bcPaint1.reset_pending_character_status(inp_char);
	$.fn.bcPaint1.get_pending_count(inp_char);
	
	$.fn.bcPaint1.get_sample(inp_char);
	$.fn.bcPaint1.get_page_dimensions();
	
	$.get("http://localhost:3000/metahtml/" + inp_char, function(data)
			{ var button_html=data; $("#button_panel").append(button_html);});
	$.get("http://localhost:3000/metacss/" + inp_char, function(data)
			{ var button_css=data; eval(button_css);});
	$.get("http://localhost:3000/metainputbox/" + inp_char, function(data)
			{ var input_box_html=data; $("#bcPaint-input-div").append(input_box_html);});
	$.get("http://localhost:3000/metapalettebuttons/" + inp_char, function(data)
			{ palette_button_html=data.replace('?','~'+inp_char); $("#bcPaint-palette").append(palette_button_html);});
	
	//$('#bcPaint-palette').find('#type_main').text('~'+inp_char);
	
	var cw = $('.button_column').find("div").width();
	$('.button_column').find("div").css({'height':cw+'px'});
	
	$('#bcPaint1').find('#bcPaint-header').trigger('click');
	
	$('.outline_on_hover').hover(
               function () {
				  $(this).css("border","1px solid grey");
               }, 
               function () {
				  $(this).css("border","0px");
               }
            );

	$('.button_column').find('div').each(function () {
		var button_id = $(this).attr('id');
		//$(this).css("background-image","url('images/e/" + button_id + ".jpg')");
		//$(this).css("background-size","100% 100%");
	});
	$('.lead_buttons').find('div').each(function () {
		var button_id = $(this).attr('id');
		$(this).css("background-image","url('//C:/Users/vnarsinghani/Desktop/Grapht/UI/Metadata/ButtonImages/lead/" + button_id + ".jpg')");
		$(this).css("background-size","100% 100%");
	});
	$('.lead2_0').css("background-image","url('//C:/Users/vnarsinghani/Desktop/Grapht/UI/Metadata/ButtonImages/lead/no_lead.jpg')");
	$(this).css("background-size","100% 100%");
	$('.lead1_0').css("background-image","url('//C:/Users/vnarsinghani/Desktop/Grapht/UI/Metadata/ButtonImages/lead/no_lead.jpg')");
	$(this).css("background-size","100% 100%");
	
	$('.point_size').each(function () {
		var size = $(this).attr('id').replace("size_","") * 1.8 + 8;
		$(this).css("height",size);
		$(this).css("width",size);
	});

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
		
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".set_colour_palette_type();");
		
	});

	//Selecting type
	$('body').on('click', '.bcPaint_palette_color', function(){
		$(this).siblings().removeClass('selected_type');
		$(this).addClass('selected_type');
		
		var type_id = $('.selected_frame').find('.selected_type').attr('id');
		if (type_id == "type_main" && $('.selected_frame').find('#subtype_1').length ==0)
			{$('.selected_frame').find('#bcPaint-palette-subtype').append("<div id='subtype_1' class='bcPaint_palette_color_subtype selected_subtype'>1</div> <div id='subtype_2' class='bcPaint_palette_color_subtype'>2</div>");
			}
		if (type_id != "type_main") 
			{$('.selected_frame').find('.bcPaint_palette_color_subtype').remove();}
	});
	
	//Selecting subtype
	$('body').on('click', '.bcPaint_palette_color_subtype', function(){
		$(this).siblings().removeClass('selected_subtype');
		$(this).addClass('selected_subtype');
	});
	
	//Resetting frame
	$('body').on('click', '#bcPaint-reset', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".reset_all();");
	});
	
	//Updating point type
	$('body').on('click', '.class_buttontype', function(){
		var frame1 = $('.selected_frame').attr('id');
		var button_type = $(this).attr('id');
		eval("$.fn." + frame1 + ".update_button_type('" + button_type + "');");
	});
	
	//Updating button in button column
	$('.selectable').on('click', function(){
		$(this).parent().find('.selected_button').removeClass('selected_button');
		$(this).addClass('selected_button');
		var button_id = $(this).attr('id');
		button_id=button_id.replace('lead1_','').replace('lead2_','').replace('start_','').replace('main_','').replace('end_','').replace('trail_','')
		var button_col_identifier = $(this).parent().attr('id');
		var input_type_identifier='#input_type_'+button_col_identifier.replace('button_col_','');
		$('.selected_frame').find(input_type_identifier).val(button_id);
		
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".remove_palette();");
		eval("$.fn." + frame1 + ".set_colour_palette_type();");
	});
	
	//Update point size
	$('body').on('click', '.point_size', function(){
		$(this).siblings().removeClass('selected_point_size');
		$(this).addClass('selected_point_size');
		var size_id = $(this).attr('id').replace("size_","");		
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".set_point_size('" + size_id + "');");
	});
	
	//Click on complete button
	$('body').on('click', '#div_complete', function(){
			var frame1 = $('.selected_frame').attr('id');
			var connected_prev = $('.selected_frame').find('#dropdown_previous_letter').val();
			var connected_next = $('.selected_frame').find('#dropdown_next_letter').val();
			
			if (connected_prev=="not_selected" || connected_next=="not_selected" ) {alert("Please select the values in dropdown"); return;}
				
			var err_msg = eval("$.fn." + frame1 + ".validate_points('" + inp_char + "');"); 
			if (err_msg != "") {alert(err_msg + "\n--------Resetting all----------");  eval("$.fn." + frame1 + ".reset_all();"); return;}
			eval("$.fn." + frame1 + ".load_point_cordinates1();");
			eval("$.fn." + frame1 + ".update_character();");
			var available_frame = $('#current_frame_count').text();
			available_frame = parseInt(available_frame) - 1;			
			if (available_frame < 1) {location.reload(true);}	
				else {$('#current_frame_count').text(available_frame);}
	});
	
	//Click undo button
	$('body').on('click', '#div_undo', function(){
		var frame1 = $('.selected_frame').attr('id');
		eval("$.fn." + frame1 + ".undo_function();");
	});
		
	//Click on Cancel button
	$('body').on('click', '#div_cancel', function(){
			var letter = prompt("Which letter is this?", "");

			if (letter == null || letter == "") 
			{
				//Nothing
			} else {
				// Update letter field value in database for this alphabet and move to new alphabet.
			}
	});
	
	//Click on Review button
	$('body').on('click', '#bcPaint-review', function(){
		if (confirm("Are you sure you want this record to be reviewed")) 
					{
						$.fn.bcPaint1.update_character_status("Review");
						location.reload(true);
					} 
	});
	
	$.fn.input_to_button_map = function() {
				if ($('.selected_frame').find('#input_type_lead1').val() == "" && $('.selected_frame').find('#input_type_lead1').length > 0) {$('.selected_frame').find('#input_type_lead1').val("0");}
				if ($('.selected_frame').find('#input_type_lead2').val() == "" && $('.selected_frame').find('#input_type_lead2').length > 0) {$('.selected_frame').find('#input_type_lead2').val("0");}
				if ($('.selected_frame').find('#input_type_end').val() == "" && $('.selected_frame').find('#input_type_end').length > 0) {$('.selected_frame').find('#input_type_end').val("0");}
				if ($('.selected_frame').find('#input_type_trail').val() == "" && $('.selected_frame').find('#input_type_trail').length > 0) {$('.selected_frame').find('#input_type_trail').val("0");}
				if ($('.selected_frame').find('#input_type_start').val() == "" && $('.selected_frame').find('#input_type_start').length > 0) {$('.selected_frame').find('#input_type_start').val("0");}
				
				var temp = "";
				var temp = $('.selected_frame').find('#input_type_lead1').val(); $.fn.input_to_button_process('lead1_' + temp);
				var temp = $('.selected_frame').find('#input_type_lead2').val(); $.fn.input_to_button_process('lead2_' + temp);
				var temp = $('.selected_frame').find('#input_type_end').val(); $.fn.input_to_button_process('end_' + temp);
				var temp = $('.selected_frame').find('#input_type_trail').val(); $.fn.input_to_button_process('trail_' + temp);
				var temp = $('.selected_frame').find('#input_type_start').val(); $.fn.input_to_button_process('start_' + temp);
				
				if ($('.selected_frame').find('#input_type_main').val() != "") {var temp = $('.selected_frame').find('#input_type_main').val(); $.fn.input_to_button_process('main_' + temp);}
				$.fn.bcPaint1.remove_palette();
            }

	$.fn.input_to_button_process = function(button_val) { 	
				$('#'+button_val).siblings().removeClass('selected_button');
				$('#'+button_val).addClass('selected_button');	
            }
			
	$.fn.set_button_input = function () {
	}
	
	function get_parameter_from_url( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
};
		
		
});



