(function( $ ) {
	/**
	* Private variables
	**/
	var isDragged		= false,
		content_type_updated = false,
		startPoint		= { x:0, y:0 },
		endPoint		= { x:0, y:0 },
		color,content_input,
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
		paintContext,button_id, x_start,y_start,x_end,y_end,width_canvas,height_canvas,counter,image_width,image_height, content_type,
		sample_id,line_number,word_number,word_y_start,word_x_start,height_contour,line_content_type,word_image_path,word_image_name,word_value,character_value,source_image_full_path, v_capital, 
		broader_image_path, broader_image_x_start, broader_image_y_start, broader_image_x_end, broader_image_y_end;
	
	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint1 = function (options) {
		
		//$('.bcPaint-image1').css("background-image","url('Image Storage/Sample2/Lines/Line1.jpg')");
		
		
		//var img = new Image();
		//img.src = 'images/Sample2.jpg';
		//img.onload = function() {image_width=this.width; image_height=this.height;}

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

				x_start=[];	//y,button_type,type,subtype
				y_start=[];
				x_end=[];
				y_end=[];	
				counter=[];
				content_type=[];
				character_value=[];
				content_type_updated = false;
			// set canvas pane width and height
			var bcCanvas = rootElement.find('#bcPaintCanvas1');
			var bcCanvasContainer = rootElement.find('#bcPaint-canvas-container');
			bcCanvas.attr('width', bcCanvasContainer.width());
			bcCanvas.attr('height', bcCanvasContainer.height());

			//$('#bcPaintCanvas1').css("width","100%");
			//$('#bcPaintCanvas1').css("height","100%");
			// get canvas pane context
			paintCanvas = document.getElementById('bcPaintCanvas1');
			paintContext = paintCanvas.getContext('2d');
			
			
			
			
	
			//width_canvas = $('.bcPaint-image1').width();//paintCanvas.width;
			//height_canvas = $('.bcPaint-image1').height();//paintCanvas.height;
			width_canvas = paintCanvas.width;
			height_canvas = paintCanvas.height;
			//alert($('#bcPaint1').find('#bcPaint-canvas-container').width() + " vs " + width_canvas);
			//alert(height_canvas);

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

		/**
		* Dispatch mouse event
		*/
		get_source_image_path_from_sample : function() {
					$.ajaxSetup({async: false});
					$.get("http://localhost:3000/samples/get_source_image_path_from_sample/" + sample_id, 
							function(data){source_image_full_path = data.source_image_full_path; //alert(source_image_full_pathx);
							}
						);	
		},
		
		get_sample : function() {
					$.ajaxSetup({async: false}); 
					$.get("http://localhost:3000/words", function(data){
						sample_id = data.sample_id;
						line_number = data.line_number;
						word_number = data.word_number;
						word_value = data.word_value;
						word_x_start = data.x_start;
						word_x_end = data.x_end;
						word_y_start = data.y_start;
						word_y_end = data.y_end;
						word_image_path = data.word_image_path;
						word_image_name = data.word_image_name;
						
						$('#bcPaintCanvas1').css("background-image","url('//" + word_image_path + word_image_name + "')");
						$('#bcPaintCanvas1').css("background-size","100% 100%");
						$.fn.bcPaint1.update_word_status("EVALUATION In-progress");
						
						var available_frame = $('#current_frame_count').text();
						//alert("1>"+available_frame);
						available_frame = parseInt(available_frame) + 1;
						$('#current_frame_count').text(available_frame);
						//alert("1>"+available_frame);
						//$.fn.bcPaint1.place_word_in_input();
					});
		},
		
		place_word_in_input : function() {
						$('#bcPaint1').find('#word_text').val(word_value); 
		},
				
		insert_into_db : function() {
				
				jQuery.each(x_start, function( i, val ) {
					var y_start_prop_this_clip = parseFloat(y_start[i])/parseFloat(height_canvas); 
						if (y_start_prop_this_clip < 0.04) { y_start_prop_this_clip=0};
					var y_start_prop_total = parseFloat(word_y_start)+parseFloat(y_start_prop_this_clip)*(parseFloat(word_y_end)-parseFloat(word_y_start)); 
					var y_end_prop_this_clip = parseFloat(y_end[i])/parseFloat(height_canvas); 
						if (y_end_prop_this_clip > 0.96) { y_end_prop_this_clip=1};
					var y_end_prop_total = parseFloat(word_y_start)+parseFloat(y_end_prop_this_clip)*(parseFloat(word_y_end)-parseFloat(word_y_start));
//alert(y_start_prop_total + ">>" + 		y_end_prop_total);				
					var x_start_prop_this_clip = parseFloat(x_start[i])/parseFloat(width_canvas); 
						if (x_start_prop_this_clip < 0.04) { x_start_prop_this_clip=0};
					var x_start_prop_total = parseFloat(word_x_start)+parseFloat(x_start_prop_this_clip)*(parseFloat(word_x_end)-parseFloat(word_x_start)); 
					var x_end_prop_this_clip = parseFloat(x_end[i])/parseFloat(width_canvas); 
						if (x_end_prop_this_clip > 0.96) { x_end_prop_this_clip=1};
					var x_end_prop_total = parseFloat(word_x_start)+parseFloat(x_end_prop_this_clip)*(parseFloat(word_x_end)-parseFloat(word_x_start));
					
//alert(x_start_prop_total + ">>" + 		x_end_prop_total);			
					v_capital = 0;
					var upper_char_value = character_value[i].toUpperCase();
					if (character_value[i] == upper_char_value) {v_capital = 1;}
					//alert(sample_id+">"+line_number+">"+word_number+">"+counter[i]+">"+word_value+">"+character_value[i]+">"+v_capital+">"+x_start_perc+">"+y_start_prop_total+">"+x_end_perc+">"+y_end_prop_total+">"+(word_image_path + word_image_name)+">"+source_image_full_path);
					
					$.post('http://localhost:3000/characters/', 
						{
							sample_id: sample_id, 
							line_number: line_number,
							word_number: word_number,
							character_number: counter[i],
							word_value: word_value,
							character_value: character_value[i],
							capital: v_capital,
							x_start: x_start_prop_total,
							y_start: y_start_prop_total,
							x_end: x_end_prop_total,
							y_end: y_end_prop_total,
							character_image_path: word_image_path.replace("/words/","/characters/") + "sample" + sample_id + "_line" + line_number + "_word" + word_number + "_character" + counter[i] + ".jpg",
							word_image_path: (word_image_path + word_image_name),
							broader_image_path: "",
							status:"new",
							source_image_full_path : source_image_full_path
						});
				});
			
				$.fn.bcPaint1.update_word_status("EVALUATION Complete");
		},
		
		update_word_status : function(input_status) {
				$.ajax({
					url: 'http://localhost:3000/words/updateStatusById',
					type: 'PUT',
					async : false,
					data:  {sample_id: sample_id,
						line_number: line_number,
						word_number: word_number,
						status: input_status}
					});	
		},
		
		reset_pending_word_status : function() {
				$.ajax({
					url: 'http://localhost:3000/words/updateStatusToNull',
					type: 'PUT',
					async : false
					});	
		},
		
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
			$('#bcPaintCanvas1').css("background-image","url('//" + word_image_path + word_image_name + "')");
			$('#bcPaintCanvas1').css("background-size","100% 100%");
			$.fn.bcPaint1.set_grid();	
			//$('#bcPaint-header').find('div').removeClass('selected_content_type');
			//$('#bcPaint-header').find('#normal').addClass('selected_content_type');		
		},

		reset_all : function(){
			$.fn.bcPaint1.reset_content_type();	
			$.fn.bcPaint1.clearCanvas();		
			x_start=[];	//y,button_type,type,subtype
			y_start=[];
			x_end=[];
			y_end=[];	
			counter=[];
			content_type=[];
			character_value=[];
			$('#calc1').text("");	
		},
		
		/**
		* On mouse down
		**/

		onMouseDown : function(e){
			if(isDragged) {isDragged = false;}//alert("Complete a click within the canvas");}
			else {
				isDragged = true;
				// get mouse x and y coordinates
				startPoint.x = e.offsetX;
				startPoint.y = e.offsetY;
				//paintContext.beginPath();
				//paintContext.fillStyle="#00FF00";paintContext.arc(startPoint.x, startPoint.y, 8, 0, 2 * Math.PI,true);paintContext.fill();	
				//x_start.push((startPoint.x*100/width_canvas));
				//y_start.push((startPoint.y*100/height_canvas));
			}
		},

		/**
		* On mouse up
		**/
		onMouseUp : function(e) {
		    isDragged = false;
			if (e.offsetX < startPoint.x) {endPoint.x=startPoint.x ; startPoint.x = e.offsetX} else {endPoint.x=e.offsetX}
			if (e.offsetY < startPoint.y) {endPoint.y=startPoint.y ; startPoint.y = e.offsetY} else {endPoint.y=e.offsetY}
			x_start.push(startPoint.x);
			y_start.push(startPoint.y);
			x_end.push(endPoint.x);
			y_end.push(endPoint.y);
			
			var selected_content_id = $('#bcPaint1').find('.selected_content_type').attr('id');
			content_type.push(selected_content_id);
			
			if (counter.length ==0) {counter.push(1);} else {counter.push(counter[counter.length-1]+1);}
			
			var word_text = $('#bcPaint1').find('#word_text').val();
			//alert(word_text);
			word_text = word_text.replace(" ","");
			word_text = word_text.split("");
			if((jQuery.type(word_text[counter.length-1]) == "undefined" || word_text[counter.length-1] == "" ) && x_start.length <1)
				{alert("Please enter a correct value in input box."); character_value.push("dummy_value");$.fn.bcPaint1.undo_function();}
			else
				{
					character_value.push(word_text[counter.length-1]);
					if (endPoint.x-startPoint.x < 0.01 * width_canvas || endPoint.y-startPoint.y < 0.01 * height_canvas) {$.fn.bcPaint1.undo_function();}
					if (character_value[counter.length-1] == "" || counter.length > word_text.length) 
						{alert("Please ensure that the line entered in the input box is correct.");$.fn.bcPaint1.undo_function();}
					$.fn.bcPaint1.outline_blocks();
				}
			},

		onMouseMove : function(e){
			if(isDragged){
				$.fn.bcPaint1.clearCanvas();
				paintContext.lineWidth = "4";
				paintContext.strokeStyle = "red";
				paintContext.beginPath();
				paintContext.rect(startPoint.x,startPoint.y,e.offsetX-startPoint.x, e.offsetY-startPoint.y);
				paintContext.stroke();
				//endPoint.x=e.offsetX;
				//endPoint.y=e.offsetY;
			}
		},

		set_grid : function() {
				var i = 0;
				//alert(width_canvas+ " " + i);
				for (i=5;i<=height_canvas;i+=15) {
					paintContext.beginPath();
					paintContext.lineWidth = 0.4;
					paintContext.strokeStyle = "grey";
					//alert(width_canvas+ " " + i);
					paintContext.moveTo(0, i);
					paintContext.lineTo(width_canvas,i);
					paintContext.stroke();
				}
				for (i=5;i<=width_canvas;i+=15) {
					paintContext.beginPath();
					paintContext.lineWidth = 0.4;
					paintContext.strokeStyle = "grey";
					//alert(width_canvas+ " " + i);
					paintContext.moveTo(i, 0);
					paintContext.lineTo(i,height_canvas);
					paintContext.stroke();
				}
		},

		outline_blocks : function() {
			$.fn.bcPaint1.clearCanvas();
			$('#bcPaint1').find('#bcPaint-mid-right').text("");
			var current_text ="";
			
			jQuery.each(x_start, function( i, val ) {
				//alert(x_start[i]+"-"+y_start[i]+"-"+x_end[i]+"-"+ y_end[i]);
					paintContext.beginPath();

					paintContext.strokeStyle = "red";			

					paintContext.lineWidth = 0.3;
					if (content_type_updated && i == (x_start.length-1)) {paintContext.lineWidth = 3;content_type_updated = false}
					
					paintContext.rect(x_start[i],y_start[i],parseFloat(x_end[i])-parseFloat(x_start[i]), parseFloat(y_end[i])-parseFloat(y_start[i]));
					
					paintContext.stroke();
					
					current_text = current_text + " <br/> " + "Word" + counter[i] + " : " + character_value[i] + " ->> "+ x_start[i].toFixed(1) +",  "+y_start[i].toFixed(1) +",  "+x_end[i].toFixed(1) +",  " + y_end[i].toFixed(1);
					$('#calc1').html(current_text);
					paintContext.beginPath();
					paintContext.fillStyle = "blue";
					paintContext.font = "20px Arial";
					paintContext.fillText(counter[i], parseFloat(x_start[i])*0.98, parseFloat(y_start[i])*0.98);
					//alert((parseFloat(y_start[i])+parseFloat(y_end[i]))*height_canvas/200);
			});
		},

		undo_function : function(){
			$.fn.bcPaint1.clearCanvas();
			x_start.pop();
			y_start.pop();
			y_end.pop();
			x_end.pop();
			content_type.pop();
			character_value.pop();
			counter.pop();
			
			//$.fn.bcPaint1.outline_blocks();

			//alert(x_start.length+","+y_start.length+","+type.length+","+subtype.length+","+button_type.length)
			//alert("check");
		},

		set_content_type : function(){
			if (x_start.length > 0) {
				var selected_content_id = $('#bcPaint1').find('.selected_content_type').attr('id');
				//alert(selected_content_id);
				content_type.pop();
				content_type.push(selected_content_id);
				content_type_updated = true ;
				 //ddf = 1/0;
			}
		},

		reset_content_type : function(){
			$('#bcPaint1').find('#bcPaint-header').find('div').removeClass('selected_content_type');
			$('#bcPaint1').find('#bcPaint-header').find('#normal').addClass('selected_content_type');
		},

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
