/**
 * Tutorial.js
 * Author: Andre Richards
 * Create fast, interactive application tutorials
 * November, 2012
 * Version 1.1.0
 *
 * Allows you to set up interactive tutorials or guides 
 * for your web application. 
 *
 * Instructions:
 * To the bottom of your webpage, open new javascript tag and 
 * use Tutorial.setup(array) with an array of ids, to prepare 
 * the tutorial.
 *
 * Call Tutorial.start() when ready to begin the tutorial.
 *
 * Note: Tutorial.js only works with dom element ids.
 */


function Tutorial()
{
	this.elementList        = new Array;
	this.position           = 0;
	this.lengthOfTutorial   = 0;
	this.container          = "#tutorial";
	this.items              = "#tutorial-items";
	this.item_container     = "#tutorial-item-container";
	this.item_outline       = true;
	this.clicktrap          = "#tutorial-clicktrap";
	this.zindex             = 10000;
	this.item_zindex        = 10001;
	this.overlay            = '#tutorial-overlay';
	this.overlay_color      = '#000';
	this.overlay_opacity    = '0.90';
	this.transition_speed   = 200;
	this.scroll_speed       = 500;
	this.alternate_scroll   = false;
	this.current_item;
	this.animation_speed;

	Tutorial.prototype.create = function()
	{
		var elem = document.createElement('div');
		elem.id = 'tutorial';
		document.body.appendChild(elem);

		$(Tutorial.container).css({
			'position':'fixed',
			'height':'100%',
			'width':'100%',
			'z-index':Tutorial.zindex,
			'top': 0,
			'left': 0,
			'display':'none'
		});

		// create overlay
		$(Tutorial.container).append("<div id='tutorial-overlay'></div>");
		Tutorial.setup_overlay();

		// create items container.
		$(Tutorial.container).append("<div id='tutorial-items'></div>");
	}

	Tutorial.prototype.start = function()
	{
		Tutorial.position = -1;
		$(Tutorial.container).fadeIn(Tutorial.animation_speed);
		Tutorial.disable_scroll();
		if(Tutorial.lengthOfTutorial > 0)
			Tutorial.next();
	}

	Tutorial.prototype.end = function()
	{
		Tutorial.current_item.destroy();
		Tutorial.destroy();
		$('html, body').animate({
				scrollTop:0
		});
		Tutorial.enable_scroll();

	}

	Tutorial.prototype.setup = function(items)
	{
		Tutorial.create();
		Tutorial.lengthOfTutorial = items.length;
		Tutorial.elementList = items;
		Tutorial.animation_speed = Math.floor(this.transition_speed/2);
	}

	// prep the overlay with configurations.
	Tutorial.prototype.setup_overlay = function()
	{       
		$(Tutorial.overlay).css({
			'position':'absolute',
			'height':'100%',
			'width':'100%',
			'z-index':Tutorial.overlay_zindex,
			'background-color': Tutorial.overlay_color,
			'opacity': Tutorial.overlay_opacity,
			'top': 0,
			'left': 0
		});
	}

	Tutorial.prototype.show = function(position)
	{
		// create container for item
		$(Tutorial.items).append('<div class="tutorial-item-container" id="tutorial-item-container"></div>');
		var item_container = $(Tutorial.item_container);

		// create item for container.
		elem = Tutorial.elementList[position];
		var item = new Tutorial_item(elem);

		// insert into container.
		$(item_container).append(item.element);

		var scrollTop = $(window).scrollTop();

		// move container
		$(item_container).css({
			'position':'absolute',
			'left': item.left,
			'top': item.top-scrollTop,
			'width': item.width,
			'height': item.height,
			'display': 'none'
		});

		// setup clicktrap
		item.trap();

		$(item_container).fadeIn(Tutorial.animation_speed);

		Tutorial.current_item = item;
	}

	Tutorial.prototype.hide = function()
	{
		if(Tutorial.current_item != null)
		Tutorial.current_item.destroy();
	}

	Tutorial.prototype.next = function()
	{
		next = Tutorial.position+1;
		if(next < Tutorial.lengthOfTutorial){
			Tutorial.hide();
			Tutorial.scroll_to(Tutorial.elementList[next]);
			setTimeout(function(){Tutorial.show(next);}, Tutorial.animation_speed+Tutorial.scroll_speed+100);
			Tutorial.position = next;
		}
		else
			Tutorial.end();
	}

	Tutorial.prototype.previous = function()
	{
		
	}

	Tutorial.prototype.scroll_to = function(elem)
	{
		var item = $("#"+elem);
		if(item.length>0){

			var scrollTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			var itemHeight = $(item).height();
			var itemTop = $(item).offset().top;

			if(Tutorial.alternate_scroll == true)
				scroll_value = (itemTop+itemHeight)-(windowHeight/2)-100;
			else
				scroll_value = itemTop-scrollTop-itemHeight;

			$('html, body').animate({
				scrollTop:scroll_value
			}, Tutorial.scroll_speed);
		}
		return true;
	}

	Tutorial.prototype.disable_scroll = function()
	{
		$("body").css("overflow","hidden");
		$(document).bind('mousewheel DOMMouseScroll',function(e){ 
		if(!e){ /* IE7, IE8, Chrome, Safari */ 
		e = window.event; 
			}
			if(e.preventDefault) { /* Chrome, Safari, Firefox */ 
				e.preventDefault(); 
			} 
			e.returnValue = false;
	});
	}

	Tutorial.prototype.enable_scroll = function()
	{
		$("body").css("overflow","auto");
		$(document).unbind('mousewheel DOMMouseScroll');
	}

	Tutorial.prototype.destroy = function()
	{
		elem = $(Tutorial.container);
		elem.fadeOut(Tutorial.animation_speed, function(){$(Tutorial.items).html()});
	}
}

function Tutorial_item(id)
{
	this.width;
	this.height;
	this.left;
	this.right;
	this.reference_id = id;
	this.element;

	// do stuff. get the element.
	select = "#"+id;
	var original = $(select);
	var clone = original.clone();
	var position = original.position();

	this.width = original.css('width');
	this.height = original.css('height');
	this.left = position.left;
	this.top = position.top;

	clone.css({
		'position': 'absolute',
		'width': original.css('width'),
		'height': original.css('height'),
	});

	this.element = clone; 

	// add clicktrap to cloned item.
	Tutorial_item.prototype.trap = function()
	{
		$(this.element).append('<div id="tutorial-clicktrap"></div>');
		$(Tutorial.clicktrap).css({
			'position':'absolute',
			'height':'100%',
			'width':'100%',
			'top':0,
			'left':0,
			'cursor':'pointer',         
		});

		if(Tutorial.item_outline == true)
			$(Tutorial.clicktrap).css({
				'padding':'10px',
				'margin': '-13px',
				'border': 'dashed 3px #ffF'
			});
	}

	// destroy
	Tutorial_item.prototype.destroy = function()
	{
		elem = this.element;
		elem.fadeOut(Tutorial.animation_speed, function(){$(Tutorial.item_container).remove()});
	}
}

var Tutorial = new Tutorial;
$(document).on('click',Tutorial.clicktrap,function(e){e.preventDefault();Tutorial.next()});
