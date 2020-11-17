/**
 * Basic Canvas Paint
 * Copyright (c) 2018 Alex Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.7.3
 */

$(document).ready(function(){
	
	$('body').on('click', '#bcPaint1', function(){
		$(this).find('#bcPaint-palette').show();
		$(this).find('#bcPaint-bottom-palette').show();
		$(this).find('canvas').show();
		$(this).siblings().find(".bcPaintfunctionality").hide();
	});
	$('body').on('click', '#bcPaint2', function(){
		$(this).find('#bcPaint-palette').show();
		$(this).find('#bcPaint-bottom-palette').show();
		$(this).find('canvas').show();
		$(this).siblings().find(".bcPaintfunctionality").hide();
	});
	$('body').on('click', '#bcPaint3', function(){
		$(this).find('#bcPaint-palette').show();
		$(this).find('#bcPaint-bottom-palette').show();
		$(this).find('canvas').show();
		$(this).siblings().find(".bcPaintfunctionality").hide();
	});
	$('body').on('click', '#bcPaint4', function(){
		$(this).find('#bcPaint-palette').show();
		$(this).find('canvas').show();
		$(this).find('#bcPaint-bottom-palette').show();
		$(this).siblings().find(".bcPaintfunctionality").hide();
	});
	
	
	
	
	$('body').on('click', '.bcPaint-palette-color', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint1.setColor($(this).css('background-color'));
	});
	$('body').on('click', '.bcPaint-palette-color2', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint2.setColor($(this).css('background-color'));
	});
	$('body').on('click', '.bcPaint-palette-color3', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint3.setColor($(this).css('background-color'));
	});
	$('body').on('click', '.bcPaint-palette-color4', function(){
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		$.fn.bcPaint4.setColor($(this).css('background-color'));
	});
	
	
	
	
	$('body').on('click', '#bcPaint-reset', function(){
		$.fn.bcPaint1.clearCanvas();
	});
	$('body').on('click', '#bcPaint-reset2', function(){
		$.fn.bcPaint2.clearCanvas();
	});
	$('body').on('click', '#bcPaint-reset3', function(){
		$.fn.bcPaint3.clearCanvas();
	});
	$('body').on('click', '#bcPaint-reset4', function(){
		$.fn.bcPaint4.clearCanvas();
	});
	
	
	
	$('body').on('click', '#bcPaint-export', function(){
		$.fn.bcPaint1.export();
	});
	$('body').on('click', '#bcPaint-export2', function(){
		$.fn.bcPaint2.export();
	});
	$('body').on('click', '#bcPaint-export3', function(){
		$.fn.bcPaint2.export();
	});
	$('body').on('click', '#bcPaint-export4', function(){
		$.fn.bcPaint2.export();
	});
	
});



