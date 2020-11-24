(function( $ ) {
	/**
	* Private variables
	**/
	var isDragged		= false,
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
		paintCanvas,paintContext,button_id, x_start,y_start,x_end,y_end,width_canvas,height_canvas,counter,image_width,image_height,content_type, 
		sample_id, image_folder_path, image_name, source_image_full_pathx;

	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint1 = function (options) {
		
		//$('.bcPaint-image1').css("background-image","url('//C:/Users/vnarsinghani/Desktop/Grapht/UI/UI - Line_with_connection/images/Sample2.jpg')");

 		$('.outline_on_hover').hover(
               function () {
               	//alert($(this).attr('id'));
				  $(this).css("border","1px solid grey");
               }, 
               function () {
				  $(this).css("border","0px");
               }
            );

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
				x_end=[];
				y_start=[];
				y_end=[];
				counter=[];
				content_type=[], 
				sample_id=0;
				

			// set canvas pane width and height
			var bcCanvas = rootElement.find('#bcPaintCanvas1');
			var bcCanvasContainer = rootElement.find('#bcPaint-canvas-container');
			bcCanvas.attr('width', bcCanvasContainer.width());
			bcCanvas.attr('height', bcCanvasContainer.height());

			// get canvas pane context
			paintCanvas = document.getElementById('bcPaintCanvas1');
			paintContext = paintCanvas.getContext('2d');
	
			width_canvas = paintCanvas.width;
			height_canvas = paintCanvas.height;
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

		get_sample : function() {		
					$.get("http://localhost:3000/samples", function(data){
						sample_id = data.sample_id;
						image_folder_path = data.image_folder_path;
						image_name = data.image_name;
						$('#bcPaintCanvas1').css("background-image","url('//" + image_folder_path+image_name + "')");
						$('#bcPaintCanvas1').css("background-size","100% 100%");
						$.ajax({
							url: 'http://localhost:3000/samples/updateStatusById',
							type: 'PUT',
							data:  {sample_id: sample_id,
							status: "In-progress"}
							});
					});
					
					//setTimeout(() => {  console.log("World!"); }, 5000);
					//alert("here");
					
					//alert(sample_id + " " + image_folder_path + " " + image_name);
		},
		
		update_status_by_id : function(inp_status) {		
					$.ajax({
							url: 'http://localhost:3000/samples/updateStatusById',
							type: 'PUT',
							async : false,
							data:  {sample_id: sample_id,
							status: inp_status}
							});
		},
		
		
		countPending : function() {		
		
					$.get("http://localhost:3000/samples/pendingCount", function(data){
						//alert("h1");
						var pending_count = data.PendingCount;
						//alert(pending_count);
						$('#pending_count_div').text(pending_count + " pages pending");
					});
					
					//setTimeout(() => {  console.log("World!"); }, 5000);
					//alert("here");
					
					//alert(sample_id + " " + image_folder_path + " " + image_name);
		},
		
		insert_into_db : function() {
			
				jQuery.each( x_start, function( i, val ) {
					//alert("source file full path :" + source_image_full_path)
					y_start_perc = parseFloat(y_start[i])*100/parseFloat(height_canvas);
					y_end_perc = parseFloat(y_end[i])*100/parseFloat(height_canvas);
				$.post('http://localhost:3000/lines/', 
					{
						sample_id: sample_id, 
						line_number: counter[i],
						content_type: content_type[i],
						y_start: y_start_perc,
						y_end: y_end_perc,
						line_image_path: image_folder_path+"lines/",
						line_image_name: "sample"+sample_id+"_line"+counter[i]+".jpg",
						status:"new",
						source_image_full_path: source_image_full_pathx
					});
			});
			
				$.ajax({
					  url: 'http://localhost:3000/samples/updateStatusById',
					  type: 'PUT',
					  data:  {sample_id: sample_id,
						status: "Complete"}
					});
		},

		update_pending_sample_status : function() {
					$.ajax({
						  url: 'http://localhost:3000/samples/updateStatusToNull',
						  type: 'PUT',
						  async: false
						});
		},
		
		get_source_image_path_from_sample : function() {
					$.ajaxSetup({async: false});
					$.get("http://localhost:3000/samples/get_source_image_path_from_sample/" + sample_id, 
							function(data){source_image_full_pathx = data.source_image_full_path; //alert(source_image_full_pathx);
							}
						);	
						//alert("hi");
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
			$.fn.bcPaint1.set_grid();			
		},

		reset_all : function(){
			$.fn.bcPaint1.clearCanvas();		
			x_start=[];	//y,button_type,type,subtype
			y_start=[];
			x_end=[];
			y_end=[];	
			counter=[];
			$('#bcPaint-mid-right').text("");
		},
		
		/**
		* On mouse down
		**/
		
		onMouseDown : function(e){
			isDragged = true;
			// get mouse x and y coordinates
			startPoint.x = e.offsetX;
			startPoint.y = e.offsetY;
			//paintContext.beginPath();
			//paintContext.fillStyle="#00FF00";paintContext.arc(startPoint.x, startPoint.y, 8, 0, 2 * Math.PI,true);paintContext.fill();	
			//x.push((startPoint.x*100/width_canvas));
			//y.push((startPoint.y*100/height_canvas));
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
			
			//alert(content_input);
			content_type.push(content_input);
			if (counter.length ==0) {counter.push(1);} else {counter.push(counter[counter.length-1]+1);}
			
			x_start.pop();x_start.push(4);
			x_end.pop(); x_end.push(width_canvas*0.98); 
			
			var div_text = $('#bcPaint-mid-right').text();
			var current_text = div_text +"\n\n\n----------------\n\n\n" + content_type[content_type.length-1] + " " + counter[counter.length-1] + " : " + x_start[x_start.length-1]+","+y_start[y_start.length-1]+","+x_end[x_end.length-1]+","+y_end[y_end.length-1];
			$('#bcPaint-mid-right').text(current_text);
			//bcPaint-mid-right

			$.fn.bcPaint1.outline_blocks();
			if (endPoint.y-startPoint.y < 0.01 * height_canvas) {$.fn.bcPaint1.undo_function();}
			
			},
		
		onMouseMove : function(e){
			if(isDragged){
				$.fn.bcPaint1.clearCanvas();
				paintContext.lineWidth = "4";
				paintContext.strokeStyle = color;
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
				for (i=10;i<=height_canvas;i+=20) {
					paintContext.beginPath();
					paintContext.lineWidth = 0.4;
					paintContext.strokeStyle = "grey";
					//alert(width_canvas+ " " + i);
					paintContext.moveTo(0, i);
					paintContext.lineTo(width_canvas,i);
					paintContext.stroke();
				}
		},
		
		
		outline_blocks : function() {
			$.fn.bcPaint1.clearCanvas();
			$('#bcPaint-mid-right').text("");
			var current_text =""
			jQuery.each( x_start, function( i, val ) {
				
					paintContext.beginPath();
					paintContext.lineWidth = 0.3;
					if (content_type[i]=="Line") {paintContext.strokeStyle = "red";} else {paintContext.strokeStyle = "purple";}
					paintContext.rect(x_start[i],y_start[i],parseFloat(x_end[i])-parseFloat(x_start[i]), parseFloat(y_end[i])-parseFloat(y_start[i]));
					paintContext.stroke();
					
					current_text = current_text + " <br/> " + content_type[i] + " " + counter[i] + " : " + x_start[i].toFixed(2) +",  "+y_start[i].toFixed(2) +",  "+x_end[i].toFixed(2) +",  " + y_end[i].toFixed(2);
					$('#bcPaint-mid-right').html(current_text);
					paintContext.beginPath();
					if (content_type[i]=="Line") {paintContext.fillStyle = "red";} else {paintContext.fillStyle = "purple";}
					paintContext.font = "20px Arial";
					paintContext.fillText((content_type[i]).substring(0, 1) + counter[i], 1, y_start[i]);
					//alert((parseFloat(y[i])+parseFloat(height_val[i]))*height_canvas/200);
			})
		},
		
		undo_function : function(){
			$.fn.bcPaint1.clearCanvas();
			
			
			x_start.pop();
			y_start.pop();
			x_end.pop();
			y_end.pop();
			content_type.pop();
			$.fn.bcPaint1.outline_blocks();
		
			
			//alert("check");
		},

		signature_color : function(){
			color = "purple";
			content_input="Signature";
		},
		default_color : function(){
			color = "red";
			content_input="Line";
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
