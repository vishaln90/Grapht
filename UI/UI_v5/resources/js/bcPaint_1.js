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
		paintContext,button_id, x,y,button_type,type,subtype,zoom_id, zoom_image;



	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint1 = function (options) {
	
		
		////////////////////// Add image to div here
		
		$('.bcPaint-image1').css("background-image","url('Pic1.PNG')");
		
		/**Placeholder
		**/
		$('#bcPaint-right').find('div').hover(
				
               function () {
				   var zoom_id = $(this).attr('id');
				   if (zoom_id == "zoom_1") {zoom_image="Pic2.jpg";}
				   else {zoom_image="Pic3.jpg";}
                  $('.bcPaint-image1').css("background-image","url('" + zoom_image + "')");
				  $(this).css("border","1px solid green");
               }, 
				
               function () {
                  $('.bcPaint-image1').css("background-image","url('Pic1.PNG')");
				  $(this).css("border","0px");
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


				x=[];	//y,button_type,type,subtype
				y=[];
				button_type=[];
				type=[];
				subtype=[];
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
		},

		/**
		* On mouse down
		**/
		
		onMouseDown : function(e){
			isDragged = false;
			// get mouse x and y coordinates
			startPoint.x = e.offsetX;
			startPoint.y = e.offsetY;
			
			var button_id = $('.selected_frame').find(".button-type-selected").attr('id');
						
			paintContext.beginPath();
			if (button_id == 'normal')
							{paintContext.fillStyle="#00FF00";paintContext.arc(startPoint.x, startPoint.y, 8, 0, 2 * Math.PI,true);paintContext.fill();}
			if (button_id == 'pointy'){
							paintContext.fillStyle="#EE82EE";
							paintContext.moveTo(startPoint.x, startPoint.y-10-2);
							paintContext.lineTo(startPoint.x-10+1, startPoint.y+10-2);
							paintContext.lineTo(startPoint.x+10-1, startPoint.y+10-2);
							paintContext.fill();
							}	
			if (button_id == 'intersect'){
							paintContext.strokeStyle="#FF0000";
							paintContext.lineWidth = 4;
							paintContext.moveTo(startPoint.x-2, startPoint.y - 10);
							paintContext.lineTo(startPoint.x+2, startPoint.y + 10);
							paintContext.moveTo(startPoint.x-10, startPoint.y-1);
							paintContext.lineTo(startPoint.x+10, startPoint.y+1);
							//paintContext.fillRect(startPoint.x, startPoint.y, 15, 15);
							paintContext.stroke();
							}	
			if (button_id == 'disconnect')
							{paintContext.strokeStyle="#FF0000";paintContext.lineWidth = 4;
								paintContext.arc(startPoint.x, startPoint.y, 8, 0, Math.PI*1/3,true);
								paintContext.stroke();
							}

			var type_val=$('.selected_frame').find(".selected_type").text();
			var subtype_val=$('.selected_frame').find(".selected_subtype").text();
			//alert(subtype_val);
			button_type.push(button_id);
			x.push(startPoint.x);
			y.push(startPoint.y);
			type.push(type_val);
			subtype.push(subtype_val);
			//subtype=subtype.push(button_type);
			//alert(button_type[button_type.length - 1]);
			//alert(button_type[button_type.length - 1]+","+x[x.length - 1]+","+y[y.length - 1])
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
			paintContext.clearRect(x[x.length-1]-10, y[y.length-1]-10, 20, 20);
			button_type.pop();
			x.pop();
			y.pop();
			type.pop();
			subtype.pop();
			//alert(x.length+","+y.length+","+type.length+","+subtype.length+","+button_type.length)
			//alert("check");
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
