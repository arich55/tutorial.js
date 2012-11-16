/**
 * tutorial.js
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
 * use tutorial.setup(array) with an array of ids, to prepare 
 * the tutorial.
 *
 * Call tutorial.start() when ready to begin the tutorial.
 *
 * Note: tutorial.js only works with dom element ids.
 */


function tutorial()
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

	tutorial.prototype.create = function()
	{
		var elem = document.createElement('div');
		elem.id = 'tutorial';
		document.body.appendChild(elem);

		$(tutorial.container).css({
			'position':'fixed',
			'height':'100%',
			'width':'100%',
			'z-index':tutorial.zindex,
			'top': 0,
			'left': 0,
			'display':'none'
		});

		// create overlay
		$(tutorial.container).append("<div id='tutorial-overlay'></div>");
		tutorial.setup_overlay();

		// create items container.
		$(tutorial.container).append("<div id='tutorial-items'></div>");
	}

	tutorial.prototype.start = function()
	{
		tutorial.position = -1;
		$(tutorial.container).fadeIn(tutorial.animation_speed);
		tutorial.disable_scroll();
		if(tutorial.lengthOfTutorial > 0)
			tutorial.next();
	}

	tutorial.prototype.end = function()
	{
		tutorial.current_item.destroy();
		tutorial.destroy();
		$('html, body').animate({
				scrollTop:0
		});
		tutorial.enable_scroll();

	}

	tutorial.prototype.setup = function(items)
	{
		tutorial.create();
		tutorial.lengthOfTutorial = items.length;
		tutorial.elementList = items;
		tutorial.animation_speed = Math.floor(this.transition_speed/2);
	}

	// prep the overlay with configurations.
	tutorial.prototype.setup_overlay = function()
	{       
		$(tutorial.overlay).css({
			'position':'absolute',
			'height':'100%',
			'width':'100%',
			'z-index':tutorial.overlay_zindex,
			'background-color': tutorial.overlay_color,
			'opacity': tutorial.overlay_opacity,
			'top': 0,
			'left': 0
		});
	}

	tutorial.prototype.show = function(position)
	{
		// create container for item
		$(tutorial.items).append('<div class="tutorial-item-container" id="tutorial-item-container"></div>');
		var item_container = $(tutorial.item_container);

		// create item for container.
		elem = tutorial.elementList[position];
		var item = new tutorial_item(elem);

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

		$(item_container).fadeIn(tutorial.animation_speed);

		tutorial.current_item = item;
	}

	tutorial.prototype.hide = function()
	{
		if(tutorial.current_item != null)
		tutorial.current_item.destroy();
	}

	tutorial.prototype.next = function()
	{
		next = tutorial.position+1;
		if(next < tutorial.lengthOfTutorial){
			tutorial.hide();
			tutorial.scroll_to(tutorial.elementList[next]);
			setTimeout(function(){tutorial.show(next);}, tutorial.animation_speed+tutorial.scroll_speed+100);
			tutorial.position = next;
		}
		else
			tutorial.end();
	}

	tutorial.prototype.previous = function()
	{
		
	}

	tutorial.prototype.scroll_to = function(elem)
	{
		var item = $("#"+elem);
		if(item.length>0){

			var scrollTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			var itemHeight = $(item).height();
			var itemTop = $(item).offset().top;

			if(tutorial.alternate_scroll == true)
				scroll_value = (itemTop+itemHeight)-(windowHeight/2)-100;
			else
				scroll_value = itemTop-scrollTop-itemHeight;

			$('html, body').animate({
				scrollTop:scroll_value
			}, tutorial.scroll_speed);
		}
		return true;
	}

	tutorial.prototype.disable_scroll = function()
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

	tutorial.prototype.enable_scroll = function()
	{
		$("body").css("overflow","auto");
		$(document).unbind('mousewheel DOMMouseScroll');
	}

	tutorial.prototype.destroy = function()
	{
		elem = $(tutorial.container);
		elem.fadeOut(tutorial.animation_speed, function(){$(tutorial.items).html()});
	}
}

function tutorial_item(id)
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
	tutorial_item.prototype.trap = function()
	{
		$(this.element).append('<div id="tutorial-clicktrap"></div>');
		$(tutorial.clicktrap).css({
			'position':'absolute',
			'height':'100%',
			'width':'100%',
			'top':0,
			'left':0,
			'cursor':'pointer',         
		});

		if(tutorial.item_outline == true)
			$(tutorial.clicktrap).css({
				'padding':'10px',
				'margin': '-13px',
				'border': 'dashed 3px #ffF'
			});
	}

	// destroy
	tutorial_item.prototype.destroy = function()
	{
		elem = this.element;
		elem.fadeOut(tutorial.animation_speed, function(){$(tutorial.item_container).remove()});
	}
}

var tutorial = new tutorial;
$(document).on('click',tutorial.clicktrap,function(e){e.preventDefault();tutorial.next()});
