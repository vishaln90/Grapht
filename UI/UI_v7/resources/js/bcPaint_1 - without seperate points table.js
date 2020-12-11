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
		paintContext,button_id, x,y,button_type,type,subtype,counter,PendingCount;



	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint1 = function (options) {
	
		
		////////////////////// Add image to div here
		
		//$('.bcPaint-image1').css("background-image","url('Pic1.PNG')");
		
		
		
		
		/**Placeholder
		**/
		$('#bcPaint-right').find('div').hover(
               function () {
				  $(this).css("border","1px solid green");
                  $('#bcPaintCanvas1').css("background-image","url('" + word_image_path + "')");
				  $('#bcPaintCanvas1').css("background-size","100% 100%");
				  //alert(word_image_path);
               }, 
               function () {
				  $(this).css("border","0px");
                  $('#bcPaintCanvas1').css("background-image","url('" + character_image_path + "')");
				  $('#bcPaintCanvas1').css("background-size","100% 100%");
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
					$.ajaxSetup({async: false}); 
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
				//alert(x.length+ " " + y.length);

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

		/**
		* On mouse down
		**/
		
		onMouseDown : function(e){
			isDragged = false;
			startPoint.x = e.offsetX;
			startPoint.y = e.offsetY;
			
			var button_id = $('.selected_frame').find(".button-type-selected").attr('id');
			var type_val=$('.selected_frame').find(".selected_type").text();
			var subtype_val=$('.selected_frame').find(".selected_subtype").text();
			
			x.push(startPoint.x);
			y.push(startPoint.y);
			button_type.push(button_id);
			type.push(type_val);
			subtype.push(subtype_val);
			if (counter.length == 0) {counter.push(1);}
				else {counter.push(counter.length+1);}
				
			if (jQuery.type(button_type[button_type.length-1]) == "undefined") {$.fn.bcPaint1.undo_function();}
			$.fn.bcPaint1.outline_blocks();
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
								{paintContext.fillStyle="#00FF00";paintContext.arc(x[i], y[i], 8, 0, 2 * Math.PI,true);paintContext.fill();}
				if (button_type[i] == 'pointy'){
								paintContext.fillStyle="#EE82EE";
								paintContext.moveTo(x[i], y[i]-10-2);
								paintContext.lineTo(x[i]-10+1, y[i]+10-2);
								paintContext.lineTo(x[i]+10-1, y[i]+10-2);
								paintContext.fill();
								}	
				if (button_type[i] == 'intersect'){
								paintContext.strokeStyle="#FF0000";
								paintContext.lineWidth = 4;
								paintContext.moveTo(x[i]-2, y[i]-10);
								paintContext.lineTo(x[i]+2, y[i]+10);
								paintContext.moveTo(x[i]-10, y[i]-1);
								paintContext.lineTo(x[i]+10, y[i]+1);
								//paintContext.fillRect(x[i], y[i], 15, 15);
								paintContext.stroke();
								}	
				if (button_type[i] == 'disconnect')
								{paintContext.strokeStyle="#FF0000";paintContext.lineWidth = 4;
									paintContext.arc(x[i], y[i], 8, 0, Math.PI*1/3,true);
									paintContext.stroke();
								}
				current_text = current_text + "<br/>Point" + counter[i] + " : " + x[i] + ", " + y[i]; //+ ", " + button_type[i]+ ", " + type[i]+ ", " + subtype[i];
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
