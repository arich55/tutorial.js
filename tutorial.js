/**
 * tutorial.js
 * Author: Andre Richards
 * Create fast, interactive application tutorials
 * November, 2012
 *
 * Allows you to set up interactive tutorials or guides 
 * for your web application. 
 *
 * Instructions:
 */


function tutorial()
{
	this.elementList 		= new Array;
	this.position 			= 0;
	this.legthOfTutorial 	= 0;
	this.container 			= "#tutorial";
	this.items 				= "#tutorial-items";
	this.zindex 			= 1000;
	this.item_zindex 		= 1001;
	this.overlay 			= '#tutorial-overlay';
	this.overlay_color 		= '#000';
	this.overlay_opacity 	= '0.8';

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
		$(tutorial.container).show();
		tutorial.disable_scroll();
		if(tutorial.legthOfTutorial > 0)
			tutorial.show(0);
	}

	tutorial.prototype.end = function()
	{

	}

	tutorial.prototype.setup = function(items)
	{
		tutorial.create();
		tutorial.legthOfTutorial = items.length;
		tutorial.elementList = items;
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
		var unique_id = 123;
		$(tutorial.items).append('<div class="tutorial-item-container" id="'+unique_id+'"></div>');
		var item_container = $("#"+unique_id);

		// create item for container.
		elem = tutorial.elementList[position];
		var item = new tutorial_item(elem);

		// insert into container.
		$(item_container).append(item.element);

		// move container
		$(item_container).css({
			'position':'absolute',
			'left': item.left,
			'top': item.top,
			'width': item.width,
			'height': item.height,
			'box-shadow': '0 0 60px rgba(255,255,255,1)',
		});
	}

	tutorial.prototype.next = function()
	{

	}

	tutorial.prototype.previous = function()
	{

	}

	tutorial.prototype.disable_scroll = function()
	{

	}

	tutorial.prototype.enable_scroll = function()
	{

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

	// do stuff
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
}

var tutorial = new tutorial;
