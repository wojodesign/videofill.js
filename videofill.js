/**
 * videofill.js
 * Author & copyright (c) 2013: John Polacek
 * Portions (c) Stephen McKinney <steve@wojodesign.com>
 * johnpolacek.com
 * https://twitter.com/johnpolacek
 *
 * Dual MIT & GPL license
 *
 * Project Page: http://wojodesign.github.io/videofill.js
 *
 * The jQuery plugin for making videos fill their containers (and be centered)
 *
 * Based on John Polacek's videofill.com
 * Project Page: http://johnpolacek.github.io/videofill.js/
 * johnpolacek.com
 * https://twitter.com/johnpolacek
 *
 * EXAMPLE
 * Given this html:
 * <div class="container"><video src="myawesomevideo.mp4" /></div>
 * $('.container').videofill(); // video stretches to fill container
 *
 *
 */
 ;(function($) {

  $.fn.videofill = function(options) {

	var $container = this,
		$video = $container.find('video').addClass('loading').css({'position':'absolute'}),
		videoAspect = 1/1,
		containersH = 0,
		containersW = 0,
		defaults = {
		  runOnce: false,
		  throttle : 200  // 5fps
		},
		settings = $.extend({}, defaults, options);

	// make sure container isn't position:static
	var containerPos = $container.css('position');
	$container.css({'overflow':'hidden','position':(containerPos === 'static') ? 'relative' : containerPos});

	// set containerH, containerW
	$container.each(function() {
	  containersH += $(this).height();
	  containersW += $(this).width();
	});

	// wait for video to load, then fit it inside the container
	
	$video.get(0).onloadedmetadata = function(){
		$video.removeClass('loading');
		fitVideos();
		if (!settings.runOnce) {
		  checkSizeChange();
		}
	}
		

	
	  

	function fitVideos() {

	  $container.each(function() {
		videoAspect = $(this).find('video').width() / $(this).find('video').height();
		
		var containerW = $(this).width();
		var containerH = $(this).height();
		var containerAspect = containerW/containerH;
		if (containerAspect < videoAspect) {
		  // taller
		  $(this).find('video').css({
			  width: 'auto',
			  height: containerH,
			  top:0,
			  left:-(containerH*videoAspect-containerW)/2
			});
		} else {
		  // wider
		  $(this).find('video').css({
			  width: containerW,
			  height: 'auto',
			  top:-(containerW/videoAspect-containerH)/2,
			  left:0
			});
		}
	  });
	}

	function checkSizeChange() {
	  var checkW = 0,
		  checkH = 0;
	  $container.each(function() {
		checkH += $(this).height();
		checkW += $(this).width();
	  });
	  if (containersH !== checkH || containersW !== checkW) {
		fitVideos();
	  }
	  setTimeout(checkSizeChange, settings.throttle);
	}

	// return for chaining
	return this;
  };

}(jQuery));
