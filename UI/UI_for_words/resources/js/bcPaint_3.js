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
		paintContext,button_id, x,y,height_val,width_val,width_canvas,height_canvas,counter,image_width,image_height,content_type;

	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint3 = function (options) {
		
		$('.bcPaint-image3').css("background-image","url('Image Storage/Sample2/Lines/Line3.jpg')");
		$('.bcPaint-image3').css("background-size","100% 100%");
		
		//var img = new Image();
		//img.src = 'images/Sample2.jpg';
		//img.onload = function() {image_width=this.width; image_height=this.height;}

		return this.each(function () {
			var rootElement 	= $(this),
				colorSet		= $.extend({}, $.fn.bcPaint3.defaults, options),
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
				content_type=[];
				content_type_updated = false;
			// set canvas pane width and height
			var bcCanvas = rootElement.find('#bcPaintCanvas3');
			var bcCanvasContainer = rootElement.find('#bcPaint-canvas-container');
			bcCanvas.attr('width', bcCanvasContainer.width());
			bcCanvas.attr('height', bcCanvasContainer.height());

			// get canvas pane context
			paintCanvas = document.getElementById('bcPaintCanvas3');
			paintContext = paintCanvas.getContext('2d');
	
			width_canvas = paintCanvas.width;
			height_canvas = paintCanvas.height;
			//alert(height_canvas);

			// bind mouse actions
			paintCanvas.onmousedown = $.fn.bcPaint3.onMouseDown;
			paintCanvas.onmouseup = $.fn.bcPaint3.onMouseUp;
			paintCanvas.onmousemove = $.fn.bcPaint3.onMouseMove;

			// bind touch actions
			paintCanvas.addEventListener('touchstart', function(e){
				$.fn.bcPaint3.dispatchMouseEvent(e, 'mousedown');
			});
			paintCanvas.addEventListener('touchend', function(e){
  				$.fn.bcPaint3.dispatchMouseEvent(e, 'mouseup');
			});
			paintCanvas.addEventListener('touchmove', function(e){
				$.fn.bcPaint3.dispatchMouseEvent(e, 'mousemove');
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
	$.extend(true, $.fn.bcPaint3, {

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
			$.fn.bcPaint3.set_grid();	
			//$('#bcPaint-header').find('div').removeClass('selected_content_type');
			//$('#bcPaint-header').find('#normal').addClass('selected_content_type');		
		},

		reset_all : function(){
			$.fn.bcPaint3.clearCanvas();		
			x=[];	//y,button_type,type,subtype
			y=[];
			height_val=[];
			width_val=[];	
			counter=[];
			content_type=[]
			$('#calc3').text("");
			$.fn.bcPaint3.reset_content_type();		
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
				x.push((startPoint.x*100/width_canvas));
				y.push((startPoint.y*100/height_canvas));
			}
		},

		/**
		* On mouse up
		**/
		onMouseUp : function(e) {
			
		    isDragged = false;
		    //alert(e.offsetY);
		    if (e.offsetX > startPoint.x) {endPoint.x = e.offsetX;} else {endPoint.x = startPoint.x; startPoint.x=e.offsetX;x.pop();x.push((startPoint.x*100/width_canvas));}
		    if (e.offsetY > startPoint.y) {endPoint.y = e.offsetY;} else {endPoint.y = startPoint.y; startPoint.y=e.offsetY;y.pop();y.push((startPoint.y*100/height_canvas));}
			var contour_width = (parseFloat(endPoint.x) - parseFloat(startPoint.x))*100/parseFloat(width_canvas);
			var contour_height = (parseFloat(endPoint.y) - parseFloat(startPoint.y))*100/parseFloat(height_canvas);
			width_val.push(contour_width);
			height_val.push(contour_height);
			
			var selected_content_id = $('#bcPaint3').find('.selected_content_type').attr('id');
			content_type.push(selected_content_id);

			//if (contour_width<0) {var temp=x[x.length-1]; temp = temp + width_val[width_val.length-1]; x.pop();x.push(temp); width_val.pop();width_val.push((-1*contour_width));}
			//if (contour_height<0) {var tempy=y[y.length-1]; tempy = tempy + height_val[height_val.length-1]; y.pop();y.push(tempy); height_val.pop();height_val.push((-1*contour_height));}
			if (counter.length ==0) {counter.push(1);} else {counter.push(counter[counter.length-1]+1);}
			
			//bcPaint-mid-right
			//alert(x.length);alert(height_val.length);
			if (contour_width==0 || contour_height==0) {$.fn.bcPaint3.undo_function();}
			$.fn.bcPaint3.outline_blocks();
			},

		onMouseMove : function(e){
			if(isDragged){
				$.fn.bcPaint3.clearCanvas();
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
			try {

			
			$.fn.bcPaint3.clearCanvas();
			$('#bcPaint-mid-right').text("");
			var current_text =""
			jQuery.each( x, function( i, val ) {
				//alert(x[i]+"-"+y[i]+"-"+width_val[i]+"-"+ height_val[i]);
					paintContext.beginPath();

					if(content_type[i] == 'normal') {paintContext.strokeStyle = "red";}
					if(content_type[i] == 'partially_scribbled') {paintContext.strokeStyle = "blue"; $.fn.bcPaint3.reset_content_type();}
					if(content_type[i] == 'scribbled') {paintContext.strokeStyle = "green";$.fn.bcPaint3.reset_content_type();}
					if(content_type[i] == 'implied_superscript') {paintContext.strokeStyle = "purple";$.fn.bcPaint3.reset_content_type();}
					if(content_type[i] == 'indicated_superscript') {paintContext.strokeStyle = "orange";$.fn.bcPaint3.reset_content_type();}				

					paintContext.lineWidth = 0.3;
					if (content_type_updated && i == (x.length-1)) {paintContext.lineWidth = 3;content_type_updated = false}
					
					paintContext.rect(x[i]*width_canvas/100,y[i]*height_canvas/100,width_val[i]*width_canvas/100, height_val[i]*height_canvas/100);
					
					paintContext.stroke();
					
					current_text = current_text + " <br/> " + "Word" + counter[i] + ": " + x[i].toFixed(1) +",  "+y[i].toFixed(1) +",  "+width_val[i].toFixed(1) +",  " + height_val[i].toFixed(1);
					$('#calc3').html(current_text);
					paintContext.beginPath();
					if(content_type[i] == 'normal') {paintContext.fillStyle = "red";}
					if(content_type[i] == 'partially_scribbled') {paintContext.fillStyle = "blue"; }
					if(content_type[i] == 'scribbled') {paintContext.fillStyle = "green";}
					if(content_type[i] == 'implied_superscript') {paintContext.fillStyle = "purple";}
					if(content_type[i] == 'indicated_superscript') {paintContext.fillStyle = "orange";}	
					paintContext.font = "20px Arial";
					paintContext.fillText(counter[i], (parseFloat(x[i])-parseFloat(width_val[i])/4)*width_canvas/100, (parseFloat(y[i])+parseFloat(height_val[i])/4)*height_canvas/100);
					//alert((parseFloat(y[i])+parseFloat(height_val[i]))*height_canvas/200);
			}

			)
			}
			catch(err) {
				isDragged=false;
				alert("Error found. Please restart marking for this line.")
  				$.fn.bcPaint3.reset_all();
			}
		},

		undo_function : function(){
			$.fn.bcPaint3.clearCanvas();
			x.pop();
			y.pop();
			height_val.pop();
			width_val.pop();
			content_type.pop();
			//$.fn.bcPaint3.outline_blocks();

			//alert(x.length+","+y.length+","+type.length+","+subtype.length+","+button_type.length)
			//alert("check");
		},

		set_content_type : function(){
			if (x.length > 0) {
				var selected_content_id = $('#bcPaint3').find('.selected_content_type').attr('id');
				//alert(selected_content_id);
				content_type.pop();
				content_type.push(selected_content_id);
				content_type_updated = true ;
				 //ddf = 1/0;
			}
		},

		reset_content_type : function(){
			$('#bcPaint3').find('#bcPaint-header').find('div').removeClass('selected_content_type');
			$('#bcPaint3').find('#bcPaint-header').find('#normal').addClass('selected_content_type');
		},

	});

	/**
	* Default color set
	**/
	$.fn.bcPaint3.defaults = {
        // default color
        defaultColor : '000000',
//DDDDDD
        // default color set
        colors : ['FFFF00', 'FFFF00', 'FFFF00', 'FFFF00', 'FFFF00'],

        // extend default set
        addColors : [],
    };

})(jQuery);
