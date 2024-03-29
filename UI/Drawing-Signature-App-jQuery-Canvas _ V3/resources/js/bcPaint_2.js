
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
							color 			: $('<div class="bcPaint-palette-color2"></div>'),
							canvasContainer : $('<div id="bcPaint-canvas-container"></div>'),
							canvasPane 		: $('<canvas id="bcPaintCanvas"></canvas>'),
							bottom 			: $('<div id="bcPaint-bottom"></div>'),
							buttonReset 	: $('<button id="bcPaint-reset2">Reset</button>'),
							buttonSave		: $('<button id="bcPaint-export2">Export</button>')

						},
		paintCanvas,
		paintContext;

	/**
	* Assembly and initialize plugin
	**/
	$.fn.bcPaint2 = function (options) {

		return this.each(function () {
			var rootElement 	= $(this),
				colorSet		= $.extend({}, $.fn.bcPaint2.defaults, options),
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
        		color = templates.color.clone();
				color.css('background-color', $.fn.bcPaint2.toHex(colorSet.colors[i]));
				rootElement.find("#bcPaint-palette").append(color);
    		});

			// set canvas pane width and height
			var bcCanvas = rootElement.find('canvas');
			var bcCanvasContainer = rootElement.find('#bcPaint-canvas-container');
			bcCanvas.attr('width', bcCanvasContainer.width());
			bcCanvas.attr('height', bcCanvasContainer.height());

			// get canvas pane context
			paintCanvas = document.getElementById('bcPaintCanvas2');
			//paintCanvas = document.getElementsByClassName('current_canvas');
			//paintCanvas = rootElement.find('#bcPaintCanvas');
			paintContext = paintCanvas.getContext('2d');

			// set color
			$.fn.bcPaint2.setColor(defaultColor);

			// bind mouse actions
			paintCanvas.onmousedown = $.fn.bcPaint2.onMouseDown;
			paintCanvas.onmouseup = $.fn.bcPaint2.onMouseUp;
			paintCanvas.onmousemove = $.fn.bcPaint2.onMouseMove;

			// bind touch actions
			paintCanvas.addEventListener('touchstart', function(e){
				$.fn.bcPaint2.dispatchMouseEvent(e, 'mousedown');
			});
			paintCanvas.addEventListener('touchend', function(e){
  				$.fn.bcPaint2.dispatchMouseEvent(e, 'mouseup');
			});
			paintCanvas.addEventListener('touchmove', function(e){
				$.fn.bcPaint2.dispatchMouseEvent(e, 'mousemove');
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
	$.extend(true, $.fn.bcPaint2, {

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
			isDragged = true;
			// get mouse x and y coordinates
			startPoint.x = e.offsetX;
			startPoint.y = e.offsetY;
			// begin context path
			paintContext.beginPath();
			paintContext.moveTo(startPoint.x, startPoint.y);
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
			paintContext.strokeStyle = $.fn.bcPaint2.toHex(color);
		},

		/**
		*
		*/
		export : function(){
			var imgData = paintCanvas.toDataURL('image/png');
			var windowOpen = window.open('about:blank', 'Image');
			windowOpen.document.write('<img src="' + imgData + '" alt="Exported Image"/>');
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
	$.fn.bcPaint2.defaults = {
        // default color
        defaultColor : '000000',

        // default color set
        colors : [
					'000000', '444444', '999999', 'DDDDDD', '6B0100', 'AD0200',
					'6B5E00', 'FFE000'
        ],

        // extend default set
        addColors : [],
    };

})(jQuery);
