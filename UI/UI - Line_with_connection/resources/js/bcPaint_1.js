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
		paintCanvas,paintContext,button_id, x,y,height_val,width_val,width_canvas,height_canvas,counter,image_width,image_height,content_type, 
		sample_id, image_folder_path, image_name;

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

				x=[];	//y,button_type,type,subtype
				y=[];
				height_val=[];
				width_val=[];	
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
						$('.bcPaint-image1').css("background-image","url('//" + image_folder_path+image_name + "')");
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
		
		insert_into_db : function() {
			
				jQuery.each( x, function( i, val ) {
				$.post('http://localhost:3000/lines/', 
					{
						sample_id: sample_id, 
						line_number: counter[i],
						content_type: content_type[i],
						y_cordinate_contour: y[i],
						height_contour: height_val[i],
						line_image_path: image_folder_path+"lines/",
						line_image_name: "sample"+sample_id+"_line"+counter[i]+".jpg",
						status:"new"
					});
			});
			
				$.ajax({
					  url: 'http://localhost:3000/samples/updateStatusById',
					  type: 'PUT',
					  data:  {sample_id: 1,
						status: "Complete"}
					});
		},

		update_pending_sample_status : function() {

					$.ajax({
						  url: 'http://localhost:3000/samples/updateStatusToNull',
						  type: 'PUT'
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
			$.fn.bcPaint1.set_grid();			
		},

		reset_all : function(){
			$.fn.bcPaint1.clearCanvas();		
			x=[];	//y,button_type,type,subtype
			y=[];
			height_val=[];
			width_val=[];	
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
			x.push((startPoint.x*100/width_canvas));
			y.push((startPoint.y*100/height_canvas));
		},

		/**
		* On mouse up
		**/
		onMouseUp : function(e) {
			
		    isDragged = false;
			var contour_width = (parseFloat(e.offsetX) - parseFloat(startPoint.x))*100/parseFloat(width_canvas);
			var contour_height = (parseFloat(e.offsetY) - parseFloat(startPoint.y))*100/parseFloat(height_canvas);
			width_val.push(contour_width);
			height_val.push(contour_height);
			//alert(content_input);
			content_type.push(content_input);
			if (contour_width<0) {var temp=x[x.length-1]; temp = temp + width_val[width_val.length-1]; x.pop();x.push(temp); width_val.pop();width_val.push((-1*contour_width));}
			if (contour_height<0) {var tempy=y[y.length-1]; tempy = tempy + height_val[height_val.length-1]; y.pop();y.push(tempy); height_val.pop();height_val.push((-1*contour_height));}
			if (counter.length ==0) {counter.push(1);}
			else {counter.push(counter[counter.length-1]+1);}
			
			x.pop();x.push(2);
			width_val.pop(); width_val.push(98); 
			
			var div_text = $('#bcPaint-mid-right').text();
			var current_text = div_text +"\n\n\n----------------\n\n\n" + content_type[content_type.length-1] + " " + counter[counter.length-1] + " : " + x[x.length-1]+","+y[y.length-1]+","+width_val[width_val.length-1]+","+height_val[height_val.length-1];
			$('#bcPaint-mid-right').text(current_text);
			//bcPaint-mid-right
			//alert(x.length);alert(height_val.length);
			$.fn.bcPaint1.outline_blocks();
			if (contour_width==0 || contour_height==00) {$.fn.bcPaint1.undo_function();}
			
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
			jQuery.each( x, function( i, val ) {
				//alert(x[i]+"-"+y[i]+"-"+width_val[i]+"-"+ height_val[i]);
					paintContext.beginPath();
					paintContext.lineWidth = 0.3;
					if (content_type[i]=="Line") {paintContext.strokeStyle = "red";} else {paintContext.strokeStyle = "purple";}
					paintContext.rect(x[i]*width_canvas/100,y[i]*height_canvas/100,width_val[i]*width_canvas/100, height_val[i]*height_canvas/100);
					paintContext.stroke();
					
					current_text = current_text + " <br/> " + content_type[i] + " " + counter[i] + " : " + x[i].toFixed(2) +",  "+y[i].toFixed(2) +",  "+width_val[i].toFixed(2) +",  " + height_val[i].toFixed(2);
					$('#bcPaint-mid-right').html(current_text);
					paintContext.beginPath();
					if (content_type[i]=="Line") {paintContext.fillStyle = "red";} else {paintContext.fillStyle = "purple";}
					paintContext.font = "20px Arial";
					paintContext.fillText((content_type[i]).substring(0, 1) + counter[i], 3, ((parseFloat(y[i])+parseFloat(height_val[i])/2)*height_canvas/100));
					//alert((parseFloat(y[i])+parseFloat(height_val[i]))*height_canvas/200);
			}

			)
		},
		
		undo_function : function(){
			$.fn.bcPaint1.clearCanvas();
			
			
			x.pop();
			y.pop();
			height_val.pop();
			width_val.pop();
			content_type.pop();
			$.fn.bcPaint1.outline_blocks();
		
			
			
			//alert(x.length+","+y.length+","+type.length+","+subtype.length+","+button_type.length)
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
