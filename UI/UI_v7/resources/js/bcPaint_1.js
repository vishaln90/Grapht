(function( $ ) {
	/**
	* Private variables
	**/
	var isDragged		= false,
		startPoint		= { x:0, y:0 },
		templates 		= {
							container 		: $('<div id="bcPaint-container"></div>'),
							header 			: $('<div id="bcPaint-header"></div>'),
							palette 		: $('<div id="bcPaint-palette"></div>'),
							color 			: $('<div id="bcPaint-palette-color" class="bcPaint-palette-color"></div>'),
							canvasContainer : $('<div id="bcPaint-canvas-container"></div>'),
							canvasPane 		: $('<canvas id="bcPaintCanvas"></canvas>'),
							bottom 			: $('<div id="bcPaint-bottom"></div>'),
							buttonReset 	: $('<button id="bcPaint-reset">Reset</button>'),
							buttonSave		: $('<button id="bcPaint-review">Review</button>')

						},
		paintCanvas,
		paintContext,button_id, x,y,button_type,type,subtype,counter,PendingCount,page_width,page_height, button_html, button_css, connected_prev, connected_next, point_size, character_id;



	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint1 = function (options) {
	

		/**Placeholder
		**/
		$('#bcPaint1').find('.zoom_image').hover(
               function () {
				  $(this).css("border","1px solid green");
				  $.fn.bcPaint1.change_image_on_canvas(word_image_path);
               }, 
               function () {
				  $(this).css("border","0px");
				  $.fn.bcPaint1.outline_blocks();
               }
            );

		return this.each(function () {
			var rootElement 	= $(this),
				colorSet		= $.extend({}, $.fn.bcPaint1.defaults, options),
				defaultColor	= (rootElement.val().length > 0) ? rootElement.val() : colorSet.defaultColor,
				container 		= templates.container.clone(),
				header 			= templates.header.clone(),
				palette 		= templates.palette.clone(),
				canvasContainer = templates.canvasContainer.clone(),
				canvasPane 		= templates.canvasPane.clone(),
				bottom 			= templates.bottom.clone(),
				buttonReset 	= templates.buttonReset.clone(),
				buttonSave 		= templates.buttonSave.clone(),
				color;

				x = [];
				y = [];
				button_type=[];
				type=[];
				subtype=[];
				counter=[];
				point_size=8;
			// assembly pane
			//rootElement.append(container);
			//container.append(header);
			//container.append(canvasContainer);
			//container.append(bottom);
			//header.append(palette);
			//canvasContainer.append(canvasPane);
			//bottom.append(buttonReset);
			//bottom.append(buttonSave);
			//$("#bcPaint-header").append(palette);
			//rootElement.find("#bcPaint-canvas-container").append(canvasPane);
			
			rootElement.find("#bcPaint-bottom-palette").append(buttonReset);
			rootElement.find("#bcPaint-bottom-palette").append(buttonSave);

			// assembly color palette
			$.each(colorSet.colors, function (i) {
        		//color = templates.color.clone();
				//color.css('background-color', $.fn.bcPaint1.toHex(colorSet.colors[i]));
				//rootElement.find("#bcPaint-palette").append(color);
    		});

			// set canvas pane width and height
			var bcCanvas = rootElement.find('canvas');
			var bcCanvasContainer = rootElement.find('#bcPaint-canvas-container');
			bcCanvas.attr('width', bcCanvasContainer.width());
			bcCanvas.attr('height', bcCanvasContainer.height());

			// get canvas pane context
			paintCanvas = document.getElementById('bcPaintCanvas1');
			//paintCanvas = document.getElementsByClassName('current_canvas');
			//paintCanvas = rootElement.find('#bcPaintCanvas');
			paintContext = paintCanvas.getContext('2d');
			
			width_canvas = paintCanvas.width;
			height_canvas = paintCanvas.height;
			// set color
			$.fn.bcPaint1.setColor(defaultColor);

			// bind mouse actions
			paintCanvas.onmousedown = $.fn.bcPaint1.onMouseDown;
			paintCanvas.onmouseup = $.fn.bcPaint1.onMouseUp;
			paintCanvas.onmousemove = $.fn.bcPaint1.onMouseMove;

			// bind touch actions
			paintCanvas.addEventListener('touchstart', function(e){
				$.fn.bcPaint1.dispatchMouseEvent(e, 'mousedown');
			});
			paintCanvas.addEventListener('touchend', function(e){
  				$.fn.bcPaint1.dispatchMouseEvent(e, 'mouseup');
			});
			paintCanvas.addEventListener('touchmove', function(e){
				$.fn.bcPaint1.dispatchMouseEvent(e, 'mousemove');
			});

			// Prevent scrolling on touch event
			document.body.addEventListener("touchstart", function (e) {
			  if (e.target == 'paintCanvas') {
			    e.preventDefault();
			  }
			}, false);
			document.body.addEventListener("touchend", function (e) {
			  if (e.target == 'paintCanvas') {
			    e.preventDefault();
			  }
			}, false);
			document.body.addEventListener("touchmove", function (e) {
			  if (e.target == 'paintCanvas') {
			    e.preventDefault();
			  }
			}, false);
		});
	}
	
	
	
	
	/**
	* Extend plugin
	**/
	$.extend(true, $.fn.bcPaint1, {
		get_source_image_path_from_sample : function() {
					$.ajaxSetup({async: false});
					$.get("http://localhost:3000/samples/get_source_image_path_from_sample/" + sample_id, 
							function(data){source_image_full_path = data.source_image_full_path; //alert(source_image_full_pathx);
							}
						);	
		},
		
		get_sample : function(inp_char) {
					//$.ajaxSetup({async: false}); 
					$.get("http://localhost:3000/characters/" + inp_char, function(data){
						sample_id = data.sample_id;
						line_number = data.line_number;
						word_number = data.word_number;
						character_number = data.character_number;
						character_value = data.character_value;
						character_x_start = data.x_start;
						character_x_end = data.x_end;
						character_y_start = data.y_start;
						character_y_end = data.y_end;
						character_id = data.character_id;
						character_image_path = data.character_image_path;
						word_image_path = data.word_image_path;
						$('#bcPaintCanvas1').css("background-image","url('//" + character_image_path + "')");
						$('#bcPaintCanvas1').css("background-size","100% 100%");
						$.fn.bcPaint1.update_character_status("In-progress");
						var available_frame = $('#current_frame_count').text();
						//alert("1>"+available_frame);
						available_frame = parseInt(available_frame) + 1;
						$('#current_frame_count').text(available_frame);
					});
		},
		
		update_character : function() {
			
			if ($('#bcPaint1').find('#dropdown_previous_letter').val() == "connected_with_previous") {connected_prev = 1;} else {connected_prev=0;}
			if ($('#bcPaint1').find('#dropdown_next_letter').val() == "connected_with_next") {connected_next = 1;} else {connected_next=0;}
			
			var lead_temp ="", start_temp="", main_temp="", main2_temp="", end_temp="", trail_temp="";
			if (jQuery.type($('.selected_frame').find('#input_type_lead1').val()) != "undefined") {lead_temp = $('.selected_frame').find('#input_type_lead1').val();}
			if (jQuery.type($('.selected_frame').find('#input_type_lead2').val()) != "undefined") {lead_temp = lead_temp + "-" + $('.selected_frame').find('#input_type_lead2').val();}
			if (jQuery.type($('.selected_frame').find('#input_type_start').val()) != "undefined") {start_temp = $('.selected_frame').find('#input_type_start').val();}
			if (jQuery.type($('.selected_frame').find('#input_type_main2').val()) != "undefined") {main2_temp = $('.selected_frame').find('#input_type_main2').val();}
			if (jQuery.type($('.selected_frame').find('#input_type_end').val()) != "undefined") {end_temp = $('.selected_frame').find('#input_type_end').val();}
			if (jQuery.type($('.selected_frame').find('#input_type_trail').val()) != "undefined") {trail_temp = $('.selected_frame').find('#input_type_trail').val();}
			$.ajax({
					url: 'http://localhost:3000/characters/update/',
					type: 'PUT',
					async : false,
					data:  {sample_id: sample_id,
						line_number: line_number,
						word_number: word_number,
						character_number: character_number,
						lead_type : lead_temp,
						start_type : start_temp,
						main_type : $('.selected_frame').find('#input_type_main').val(),
						main2_type : main2_temp,
						end_type : end_temp,
						trail_type : trail_temp,
						connected_with_previous : connected_prev,
						connected_with_next : connected_next}
					});
		},
		
		get_page_dimensions : function() {
					//$.ajaxSetup({async: false}); 
					$.get("http://localhost:3000/samples/page_dimensions/" + sample_id, function(data){
						page_height = data.paper_height;
						page_width = data.paper_width;
					});
		},
		
		place_word_in_input : function() {
						$('#bcPaint1').find('#word_text').val(word_value); 
		},
				
		load_point_cordinates : function() {
				jQuery.each(type, function( i, val ) {
						var y_start_prop_this_clip = parseFloat(y[i])/parseFloat(height_canvas); 
							if (y_start_prop_this_clip < 0.04) { y_start_prop_this_clip=0};
						var y_start_prop_total = parseFloat(character_y_start)+parseFloat(y_start_prop_this_clip)*(parseFloat(character_y_end)-parseFloat(character_y_start)); 
						y[i]=y_start_prop_total;
						//alert(y_start_prop_total + ">>" + 		y_end_prop_total);				
						var x_start_prop_this_clip = parseFloat(x[i])/parseFloat(width_canvas); 
							if (x_start_prop_this_clip < 0.04) { x_start_prop_this_clip=0};
						var x_start_prop_total = parseFloat(character_x_start)+parseFloat(x_start_prop_this_clip)*(parseFloat(character_x_end)-parseFloat(character_x_start)); 
						x[i] = x_start_prop_total;
				});
				
				$.each([ -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], function(i){
						if (i > x.length-1) {x.push(-1);y.push(-1);}
				});

				$.ajax({
					url: 'http://localhost:3000/characters/load_point_cordinates',
					type: 'PUT',
					data: {sample_id: sample_id, 
							line_number: line_number,
							word_number: word_number,
							character_number: character_number,
							measure1_x: x[0],measure1_y: y[0],measure2_x: x[1],measure2_y: y[1],
							measure3_x: x[2],measure3_y: y[2],measure4_x: x[3],measure4_y: y[3],
							measure5_x: x[4],measure5_y: y[4],measure6_x: x[5],measure6_y: y[5],
							measure7_x: x[6],measure7_y: y[6],measure8_x: x[7],measure8_y: y[7],
							measure9_x: x[8],measure9_y: y[8],measure10_x: x[9],measure10_y: y[9],
							measure11_x: x[10],measure11_y: y[10],measure12_x: x[11],measure12_y: y[11],
							measure13_x: x[12],measure13_y: y[12],measure14_x: x[13],measure14_y: y[13],
							measure15_x: x[14],measure15_y: y[14],measure16_x: x[15],measure16_y: y[15],
							measure17_x: x[16],measure17_y: y[16],measure18_x: x[17],measure18_y: y[17],
							measure19_x: x[18],measure19_y: y[18],measure20_x: x[19],measure20_y: y[19]}
					});
		},		
		
		load_point_cordinates1 : function() {
				jQuery.each(type, function( i, val ) {
						var y_start_prop_this_clip = parseFloat(y[i])/parseFloat(height_canvas); 
							if (y_start_prop_this_clip < 0.04) { y_start_prop_this_clip=0};
						var y_start_prop_total = parseFloat(character_y_start)+parseFloat(y_start_prop_this_clip)*(parseFloat(character_y_end)-parseFloat(character_y_start)); 
						y[i]=y_start_prop_total*parseFloat(page_height)/100;
						//alert(y_start_prop_total + ">>" + 		y_end_prop_total);				
						var x_start_prop_this_clip = parseFloat(x[i])/parseFloat(width_canvas); 
							if (x_start_prop_this_clip < 0.04) { x_start_prop_this_clip=0};
						var x_start_prop_total = parseFloat(character_x_start)+parseFloat(x_start_prop_this_clip)*(parseFloat(character_x_end)-parseFloat(character_x_start)); 
						x[i] = x_start_prop_total*parseFloat(page_width)/100;
				
				$.ajax({
					url: 'http://localhost:3000/points',
					type: 'PUT',
					data: { sample_id: sample_id, 
							line_number: line_number,
							word_number: word_number,
							character_number: character_number,
							character_value: character_value,
							point_number:counter[i],
							point_type: button_type[i],
							section_type: type[i],
							section_subtype: subtype[i],
							x : x[i],
							y : y[i],
							character_id: character_id}
				});
			});
				$.fn.bcPaint1.update_character_status("Complete");
		},
		
		update_character_status : function(input_status) {
				$.ajax({
					url: 'http://localhost:3000/characters/updateStatusById',
					type: 'PUT',
					async : false,
					data:  {sample_id: sample_id,
						line_number: line_number,
						word_number: word_number,
						character_number: character_number,
						status: input_status}
					});	
		},
		
		reset_pending_character_status : function(inp_char) {
				$.ajax({
					url: 'http://localhost:3000/characters/updateStatusToNull/'+inp_char,
					type: 'PUT',
					async : false
					});	
		},
		
		get_pending_count : function(inp_char) {
				$.ajaxSetup({async: false}); 
				$.get('http://localhost:3000/characters/pendingCount/'+inp_char, function(data){
						PendingCount = data.PendingCount;
				});
				$('#pending_count_div').text(PendingCount + " characters pending.");	
		},
		
		/**
		* Dispatch mouse event
		*/
		dispatchMouseEvent : function(e, mouseAction){
			var touch = e.touches[0];
			if(touch == undefined){
				touch = { clientX : 0, clientY : 0 };
			}
			var mouseEvent = new MouseEvent(mouseAction, {
				clientX: touch.clientX,
				clientY: touch.clientY
			});
			paintCanvas.dispatchEvent(mouseEvent);
		},

		/**
		* Remove pane
		*/
		clearCanvas : function(){
			paintCanvas.width = paintCanvas.width;
			$('#bcPaintCanvas1').css("background-image","url('//" + character_image_path + "')");
			$('#bcPaintCanvas1').css("background-size","100% 100%");
		},
		
		change_image_on_canvas : function(image_path){
			paintCanvas.width = paintCanvas.width;
			$('#bcPaintCanvas1').css("background-image","url('//" + image_path + "')");
			$('#bcPaintCanvas1').css("background-size","100% 100%");
		},

		/**
		* On mouse down
		**/
		
		onMouseDown : function(e){
			isDragged = false;
			
			startPoint.x = e.offsetX;
			startPoint.y = e.offsetY;
			
			var button_id = $('#bcPaint1').find(".button-type-selected").attr('id');
			var type_val=$('#bcPaint1').find(".selected_type").text();
			var subtype_val= $('#bcPaint1').find(".selected_subtype").text();
			//try {var subtype_val= $('#bcPaint1').find(".selected_subtype").text();}  
				//catch(err) {var subtype_val = 0;}
				
			x.push(startPoint.x);
			y.push(startPoint.y);
			button_type.push(button_id);
			type.push(type_val);
			subtype.push(subtype_val);
			if (counter.length == 0) {counter.push(1);}
				else {counter.push(counter.length+1);}
				
			var undo_flag = 0;
			var selected_frame_id = $('.selected_frame').attr('id');
			if (jQuery.type(selected_frame_id) == "undefined" || jQuery.type(button_type[button_type.length-1]) == "undefined") {undo_flag = 1; $.fn.bcPaint1.undo_function(); }
			
			if (jQuery.type(selected_frame_id) != "undefined"  && ($.fn.bcPaint1.check_input_box('input_type_lead1') || $.fn.bcPaint1.check_input_box('input_type_lead2') || $.fn.bcPaint1.check_input_box('input_type_start') || $.fn.bcPaint1.check_input_box('input_type_main') || $.fn.bcPaint1.check_input_box('input_type_main2') || $.fn.bcPaint1.check_input_box('input_type_end') || $.fn.bcPaint1.check_input_box('input_type_trail')))
				{alert("Please select buttons first"); $.fn.bcPaint1.undo_function();}
			if (type[type.length-1] == ""){alert("Please select TYPE before marking."); $.fn.bcPaint1.undo_function();}
			
			$.fn.bcPaint1.outline_blocks();
		},
		
		check_input_box : function(input_box_id) {
				if ($('#bcPaint1').find('#'+input_box_id).val() == "" && $('#bcPaint1').find('#'+input_box_id).length > 0) 
					{return true;}
				else {return false;}
		},
		/**
		* On mouse up
		**/
		onMouseUp : function() {
		    isDragged = false;
		},

		/**
		* On mouse move
		**/
		onMouseMove : function(e){
			if(isDragged){
				paintContext.lineTo(e.offsetX, e.offsetY);
				paintContext.stroke();
			}
		},

		/**
		* Set selected color
		**/
		setColor : function(color){
			paintContext.strokeStyle = $.fn.bcPaint1.toHex(color);
		},

		/**
		*
		*/
		export : function(){
			var imgData = paintCanvas.toDataURL('image/png');
			var windowOpen = window.open('about:blank', 'Image');
			windowOpen.document.write('<img src="' + imgData + '" alt="Exported Image"/>');
		},
		
		
		undo_function : function(color){
			//paintContext.clearRect(x[x.length-1]-10, y[y.length-1]-10, 20, 20);
			button_type.pop();
			x.pop();
			y.pop();
			type.pop();
			subtype.pop();
			counter.pop();
			$.fn.bcPaint1.outline_blocks();
		},
		
		update_button_type : function(inp_button_type) {
			if (button_type.length > 0)
			{
				button_type.pop();
				button_type.push(inp_button_type);
				//alert(button_type[button_type.length-1]);
				$.fn.bcPaint1.outline_blocks();
				
			}				
		},
		
		
		outline_blocks : function() {
			$.fn.bcPaint1.clearCanvas();
			$('#calc1').text("");
			var current_text ="";
			
			jQuery.each(type, function( i, val ) {
				paintContext.beginPath();
				if (button_type[i] == 'normal')
								{paintContext.fillStyle="#00FF00";paintContext.arc(x[i], y[i], point_size, 0, 2 * Math.PI,true);paintContext.fill();}
				if (button_type[i] == 'pointy'){
								paintContext.fillStyle="#FFF000";
								paintContext.moveTo(x[i], y[i]-(point_size*1.4));
								paintContext.lineTo(x[i]-(point_size*1.1), y[i]+point_size);
								paintContext.lineTo(x[i]+(point_size*1.1), y[i]+point_size);
								paintContext.fill();
								}	
				if (button_type[i] == 'intersect'){
								paintContext.strokeStyle="#FF00FF";
								paintContext.lineWidth = 3;
								paintContext.moveTo(x[i]-(point_size*0.25), y[i]-(point_size*1.25));
								paintContext.lineTo(x[i]+(point_size*0.25), y[i]+(point_size*1.25));
								paintContext.moveTo(x[i]-(point_size*1.25), y[i]-1);
								paintContext.lineTo(x[i]+(point_size*1.25), y[i]+1);
								//paintContext.fillRect(x[i], y[i], 15, 15);
								paintContext.stroke();
								}	
				if (button_type[i] == 'disconnect')
								{paintContext.strokeStyle="#FF0000";paintContext.lineWidth = 3;
									paintContext.arc(x[i], y[i], point_size+2, 0, Math.PI*1/3,true);
									paintContext.stroke();
								}
				current_text = current_text + "<br/>Point" + counter[i] + " : " + button_type[i] + " . " + x[i] + ", " + y[i] + " <- " + type[i] + "." + subtype[i] ; //+ ", " + button_type[i]+ ", " + type[i]+ ", " + subtype[i];
			});
			$('#calc1').html(current_text);
		},
		
		
		reset_all : function(){
			$.fn.bcPaint1.clearCanvas();
			$('#calc1').text("");
			button_type=[];
			x=[];
			y=[];
			type=[];
			subtype=[];
			counter=[];
			$.fn.bcPaint1.set_colour_palette_type();
			},
		
		set_colour_palette_type : function(){
			if (type.length > 0) {return;}
			$('.selected_frame').find('.selected_type').removeClass('selected_type');
			$('.selected_frame').find('.selected_subtype').removeClass('selected_subtype');
			if ($('.selected_frame').find('#type_lead').is(":visible")) {$.fn.bcPaint1.add_remove_subtype("remove"); $('.selected_frame').find('#type_lead').addClass('selected_type'); return;}
			if ($('.selected_frame').find('#type_start').is(":visible")) {$.fn.bcPaint1.add_remove_subtype("remove"); $('.selected_frame').find('#type_start').addClass('selected_type'); return;}
			if ($('.selected_frame').find('#type_main').is(":visible")) 
				{$('.selected_frame').find('#type_main').addClass('selected_type'); 
				$.fn.bcPaint1.add_remove_subtype("add"); $('.selected_frame').find('#subtype_1').addClass('selected_subtype');
				return;}
		},
		
		add_remove_subtype : function(inp_decision){
			if (inp_decision=="remove") {$('.selected_frame').find('.bcPaint_palette_color_subtype').remove(); return;}
			if ($('.selected_frame').find('.bcPaint_palette_color_subtype').length > 0) {return;}
			$('.selected_frame').find('#bcPaint-palette-subtype').append("<div id='subtype_1' class='bcPaint_palette_color_subtype selected_subtype'>1</div> <div id='subtype_2' class='bcPaint_palette_color_subtype'>2</div>");
		},
		
		validate_points : function(inp_char){
			var err_msg = "";		
			
			var temp = [];
			temp = jQuery.grep(type, function(a) {return(a == "l");});
			if ($('.lead_buttons').length > 0 && temp.length < 3 && ($('#button_col_lead1').find('.selected_button').attr('id')!="lead1_0" || $('#button_col_lead2').find('.selected_button').attr('id')!="lead2_0")) {err_msg = err_msg + "\nMark at least 3 lead points.";}
			temp = jQuery.grep(type, function(a) {return(a == "s");});
			if ($('.start_buttons').length > 0 && temp.length < 4 && $('#button_col_start').find('.selected_button').attr('id')!="start_0") {err_msg = err_msg + "\nMark at least 4 start points.";}
			temp = jQuery.grep(type, function(a) {return(a == "~"+inp_char);});
			if (temp.length < 4 ) 
				{err_msg = err_msg + "\nMark at least 4 main points.";}
			else {
				var subtype_err_flag = false;
				temp = jQuery.grep(subtype, function(a) {return(a == "1");}); if ($('#subtype_1').length > 0 && temp.length < 3) {subtype_err_flag=true;}
				temp = jQuery.grep(subtype, function(a) {return(a == "2");}); if ($('#subtype_2').length > 0 && temp.length < 3) {subtype_err_flag=true;}
				temp = jQuery.grep(subtype, function(a) {return(a == "3");}); if ($('#subtype_3').length > 0 && temp.length < 3) {subtype_err_flag=true;}
				temp = jQuery.grep(subtype, function(a) {return(a == "4");}); if ($('#subtype_4').length > 0 && temp.length < 3) {subtype_err_flag=true;}
				if (subtype_err_flag) {err_msg = err_msg + "\nMark at least 3 end points for each subtype.";}
				};

			temp = jQuery.grep(type, function(a) {return(a == "e");});
			if ($('.end_buttons').length > 0 && temp.length < 4 && $('#button_col_end').find('.selected_button').attr('id')!="end_0") {err_msg = err_msg + "\nMark at least 4 end points.";}
			temp = jQuery.grep(type, function(a) {return(a == "t");});
			if ($('.trail_buttons').length > 0 && temp.length < 4 && $('#button_col_trail').find('.selected_button').attr('id')!="trail_0") {err_msg = err_msg + "\nMark at least 4 trail points.";}
			return err_msg;				
		},
		
		remove_palette : function(){
			if ($('.lead_buttons').length > 0 && $('#button_col_lead1').find('.selected_button').attr('id')=="lead1_0" && $('#button_col_lead2').find('.selected_button').attr('id')=="lead2_0") 
				{$('.selected_frame').find('#type_lead').hide();}
				else {$('.selected_frame').find('#type_lead').show();}
			if ($('.start_buttons').length > 0 && $('#button_col_start').find('.selected_button').attr('id')=="start_0") 
				{$('.selected_frame').find('#type_start').hide();}	
				else {$('.selected_frame').find('#type_start').show();}
			if ($('.end_buttons').length > 0 && $('#button_col_end').find('.selected_button').attr('id')=="end_0") 
				{$('.selected_frame').find('#type_end').hide();}
				else {$('.selected_frame').find('#type_end').show();}
			if ($('#button_col_main2').length > 0 && $('#button_col_main2').find('.selected_button').attr('id')=="main2_0") 
				{$('.selected_frame').find('#type_main2').hide();}
				else {$('.selected_frame').find('#type_main2').show();}
			if ($('.trail_buttons').length > 0 && $('#button_col_trail').find('.selected_button').attr('id')=="trail_0") 
				{$('.selected_frame').find('#type_trail').hide();}	
				else {$('.selected_frame').find('#type_trail').show();}
		},
		
		set_point_size : function(size){
			point_size=size*1.5+2;
			$.fn.bcPaint1.outline_blocks();
		},
		
		/**
		* Convert color to HEX value
		**/
		toHex : function(color) {
		    // check if color is standard hex value
		    if (color.match(/[0-9A-F]{6}|[0-9A-F]{3}$/i)) {
		        return (color.charAt(0) === "#") ? color : ("#" + color);
		    // check if color is RGB value -> convert to hex
		    } else if (color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/)) {
		        var c = ([parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)]),
		            pad = function (str) {
		                if (str.length < 2) {
		                    for (var i = 0, len = 2 - str.length; i < len; i++) {
		                        str = '0' + str;
		                    }
		                }
		                return str;
		            };
		        if (c.length === 3) {
		            var r = pad(c[0].toString(16)),
		                g = pad(c[1].toString(16)),
		                b = pad(c[2].toString(16));
		            return '#' + r + g + b;
		        }
		    // else do nothing
		    } else {
		        return false;
		    }
		}

	});

	/**
	* Default color set
	**/
	$.fn.bcPaint1.defaults = {
        // default color
        defaultColor : '000000',
//DDDDDD
        // default color set
        colors : ['FFFF00', 'FFFF00', 'FFFF00', 'FFFF00', 'FFFF00'],

        // extend default set
        addColors : [],
    };

})(jQuery);
