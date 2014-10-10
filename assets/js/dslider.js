/*
 * dSlider v1.0
 * Copyright 2014, Derwin Sadiwa - http://www.derwinsadiwa.com
 * Released under the MIT license - http://opensource.org/licenses/MIT
 * 
 */

(function ($) {
	"use strict";
	$.fn.dSlider = function(options){

		var config = $.extend({
			easing: Power2.easeInOut,
			timeInterval: 3000,
			timeBetweenSlides: 0.8,
			hasArrowAnimation: true,
			hasArrowNavigation: true,
			hasDotNavigation: true
		}, options);

	    return this.each(function(){

	    	var $this = $(this),
	    		$thisId = $this.attr('id'),
	    		$slider_content = $('#'+$thisId+' #slider_content');

	    	var img = $('#'+$thisId+' #slider_content img');
			 	img.wrap('<figure></figure');
			 	$('#'+$thisId+' #slider_content figure').addClass('slider_content_img');

	    	var node_figs = $('#'+$thisId+' #slider_content figure'),
				first_node_figs = node_figs[0],
				fig_wrap = first_node_figs.cloneNode(true); 

			$slider_content.append(fig_wrap);
			
			var len = $slider_content.children('figure').length,
				last_node_figs = node_figs[len-2],
				fig_last = last_node_figs.cloneNode(true);

			$slider_content.prepend(fig_last);
			
			var total_slides = $slider_content.children('figure').length,
				w_slides_wrapper = total_slides * 100,
				w_percentage = 100/total_slides,
				counter = 0,
				arrow_time = 0.3,
				timeoutId,
				slides = {
			 		w: $('.slider_content_img').width(),
			 		h: $('.slider_content_img').height(),
			 		nav_animation: 'true'
			 	}

			 var initControllers = function(){

				$('#'+$thisId).append('<div id="slider_nav" class="dotstyle dotstyle-dotmove clearfix">');

				var $slider_nav = document.getElementById('slider_nav');
				$slider_nav.innerHTML += '<ul id="dot-nav"></ul>';
				var ul = document.getElementById('dot-nav');

				var i = 1;
				while(i < total_slides-1){
					var li = document.createElement('li');
					li.innerHTML += '<a href="javascript:void();">'+i+'</a>'; 
					ul.appendChild(li);
					i++;
				}
				ul.appendChild(document.createElement('li'));
				$('#'+$thisId).append("<nav id='prev_next_btn'><div id='prev_btn'><i class='ion-chevron-left'></i></div>\n<div id='next_btn'><i class='ion-chevron-right'></i></div></nav>");
				var $prev_next_btn = document.getElementById('prev_next_btn');
				TweenLite.to([$('#prev_btn'), $('#next_btn')], 0, { autoAlpha:0 });

				if(!config.hasDotNavigation){
					TweenLite.to($slider_nav, 0, { autoAlpha:0 });
				}

				if(!config.hasArrowNavigation){
					TweenLite.to($prev_next_btn, 0, { autoAlpha:0 });
				}

			}
			
			var init = function(){

		 		counter = counter + 1;
		 		TweenLite.to($slider_content, 0, {css:{left:-(counter*100)+'%'} });
		 		initControllers();
		 		setController();
		 		initPreloader();
		 		
				$('#'+$thisId).css({
					'max-width': slides.w+'px',
					'text-align': 'center',
					position: 'relative',
					margin: '0 auto',
					overflow: 'hidden'
				});

		 		$slider_content.css({
		 			width: w_slides_wrapper+'%',
		 			position: 'relative'
		 		});

		 		$('.slider_content_img').css({
		 			width: w_percentage+'%'
		 		});
				
		 	}
		 	
			var setTimer = function() {

				timeoutId = setTimeout(setTimeFunc, config.timeInterval);
				return false;

			}

			var animateSlides = function(num){

				TweenLite.killTweensOf([$('.dotstyle-dotmove li:last-child'), $slider_content]);

				if(config.hasNavAnimation){
					if(counter <= 0){
						TweenLite.to($('.dotstyle-dotmove li:last-child'), config.timeBetweenSlides, { css:{left:(48*(total_slides-3))}, ease:config.easing});
					}else if(counter >= total_slides-1){
						TweenLite.to($('.dotstyle-dotmove li:last-child'), config.timeBetweenSlides, { css:{left:(48*(num-(total_slides-1)))}, ease:config.easing});
					}else{
						TweenLite.to($('.dotstyle-dotmove li:last-child'), config.timeBetweenSlides, { css:{left:(48*(num-1))}, ease:config.easing});
					}
					TweenLite.to($slider_content, config.timeBetweenSlides, {css:{left:-(num*100)+'%'}, ease:config.easing });
				}else{
					if(counter <= 0){
						TweenLite.to($('.dotstyle-dotmove li:last-child'), 0, { css:{left:(48*(total_slides-3))}, ease:config.easing});
					}else if(counter >= total_slides-1){
						TweenLite.to($('.dotstyle-dotmove li:last-child'), 0, { css:{left:(48*(num-(total_slides-1)))}, ease:config.easing});
					}else{
						TweenLite.to($('.dotstyle-dotmove li:last-child'), 0, { css:{left:(48*(num-1))}, ease:config.easing});
					}
					TweenLite.to($slider_content, config.timeBetweenSlides, {css:{left:-(num*100)+'%'}, ease:config.easing });
				}

			}
			
			var checkNextPrevLimit = function(){

				if (counter < 0){
					counter = total_slides-2;
					$slider_content.css({
						left: -(counter*100)+'%'
					});
					counter = counter - 1;
					animateSlides(counter);
				}else if (counter >= total_slides) {
					counter = 1;
					$slider_content.css({
						left: -(counter*100)+'%'
					});
					counter = 2;
					animateSlides(counter);
				}else{
					animateSlides(counter);
				}

			}

			var setTimeFunc = function() {

				counter++;
				checkNextPrevLimit();
				setTimer();
				return false;
				
			}

			var setController = function(){

				$('ul#dot-nav li').each(function(index) {
			  		$(this).click(function(){
			  			counter = index+1;
						animateSlides(counter);
						clearInterval(timeoutId);
					})
				});

				$('#prev_btn').click(function(){
					clearInterval(timeoutId);
					counter--;
					checkNextPrevLimit();
				});

				$('#next_btn').click(function(){
					clearInterval(timeoutId);
					counter++;
					checkNextPrevLimit();
				});
				
				$('#slider').hover(
					function() {
						if(!config.hasNavAnimation){
							TweenLite.to([$('#prev_btn'), $('#next_btn')], arrow_time, { autoAlpha:1 });
						    TweenLite.to($('#prev_btn'), 0, { css:{scaleX: 1, scaleY:1, left:'0px'}, ease:Back.easeOut });
						    TweenLite.to($('#next_btn'), 0, { css:{scaleX: 1, scaleY:1, right:'0px'}, ease:Back.easeOut });
						}else{
						    TweenLite.to([$('#prev_btn'), $('#next_btn')], arrow_time, { autoAlpha:1 });
						    TweenLite.to($('#prev_btn'), arrow_time, { css:{scaleX: 1, scaleY:1, left:'0px'}, ease:Back.easeOut });
						    TweenLite.to($('#next_btn'), arrow_time, { css:{scaleX: 1, scaleY:1, right:'0px'}, ease:Back.easeOut });
					    }
					}, function() {
						if(!config.hasNavAnimation){
							TweenLite.to([$('#prev_btn'), $('#next_btn')], arrow_time, { autoAlpha:0 });
						    TweenLite.to($('#prev_btn'), 0, { css:{scaleX: 1, scaleY:1, left:'0px'}, ease:Back.easeIn});
						    TweenLite.to($('#next_btn'), 0, { css:{scaleX: 1, scaleY:1, right:'0px'}, ease:Back.easeIn});
						}else{
							TweenLite.to([$('#prev_btn'), $('#next_btn')], arrow_time, { autoAlpha:0 });
					    	TweenLite.to($('#prev_btn'), arrow_time, { css:{scaleX: 1, scaleY:1, left:'70px'}, ease:Back.easeIn});
					    	TweenLite.to($('#next_btn'), arrow_time, { css:{scaleX: 1, scaleY:1, right:'70px'}, ease:Back.easeIn});
						}
					    
					}
				);

			}

			var initPreloader = function(){
				
				var img_arr = [];

				$('#slider_content figure').each(function(index) {
					var _fig = document.getElementsByTagName('figure');
					_fig[index].innerHTML += '<i class="icon ion-ios7-reloading"></i>';
					var icon_preloader = document.getElementsByClassName('ion-ios7-reloading');
					$('.ion-ios7-reloading').css({
						display: 'block',
						position: 'absolute',
						left: (slides.w/2)-($('.ion-ios7-reloading').width()/2)+'px',
						top: (slides.h/2)-($('.ion-ios7-reloading').height()/2)+'px'
					});
				});

				$('#'+$thisId+' figure img').each(function(index) {
					img_arr[index] = new Image();
					img_arr[index].onLoad = imagesLoaded(index);
				});

			}

			var imagesLoaded = function(num){
				$('.ion-ios7-reloading').css({
					display: 'none'
				});
			}

			init();
			setTimer();

	    });
	    	
	};

}( jQuery ));


