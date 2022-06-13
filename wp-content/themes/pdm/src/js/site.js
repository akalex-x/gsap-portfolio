document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, "") + "js"

if (window.location.hash) { setTimeout(function () { window.scrollTo(0, 0); }, 2); }

jQuery(document).ready(function ($) {

    /*-----------------------------------------------------------------------------GLOBAL ON LOAD----*/
    
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    var grainyBackground = (function(){
        var grainedOptions = {
            "animate": true,
            "patternWidth": 200,
            "patternHeight": 200,
            "grainOpacity": .1,
            "grainDensity": 1,
            "grainWidth": 1,
            "grainHeight": 1
        }
        grained("#viewport", grainedOptions);
    }()); 

    var LazyLoading = (function () {
        var instance = new LazyLoad();
        function lazyBGImages() {
            var $bgImages = $('[data-bg]:not(.lazy)');
            if ($bgImages.length) {
                $bgImages.each(function () {
                    $(this).addClass('lazy');
                });
            }
            instance.update();
        }
        function update() {
            lazyBGImages();
        }
        lazyBGImages();
        return {
            update: update
        }
    }());
    
    
    // this is the helper function that sets it all up. Pass in the content <div> and then the wrapping viewport <div> (can be the elements or selector text). It also sets the default "scroller" to the content so you don't have to do that on all your ScrollTriggers.
    function smoothScroll(content, viewport, smoothness) {
        content = gsap.utils.toArray(content)[0];
        smoothness = smoothness || 1;

        gsap.set(viewport || content.parentNode, { overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0 });
        gsap.set(content, { overflow: "visible", width: "100%" });

        var getProp = gsap.getProperty(content),
            setProp = gsap.quickSetter(content, "y", "px"),
            setScroll = ScrollTrigger.getScrollFunc(window),
            removeScroll = function removeScroll() {
            return content.style.overflow = "visible";
        },
            killScrub = function killScrub(trigger) {
            var scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
            scrub && scrub.kill();
            trigger.animation.progress(trigger.progress);
        },
            height = void 0,
            isProxyScrolling = void 0;

        function refreshHeight() {
            height = content.clientHeight;
            content.style.overflow = "visible";
            document.body.style.height = height + "px";
            return height - document.documentElement.clientHeight;
        }

        ScrollTrigger.addEventListener("refresh", function () {
            removeScroll();
            requestAnimationFrame(removeScroll);
        });

        ScrollTrigger.defaults({ scroller: content });

        ScrollTrigger.scrollerProxy(content, {
            scrollTop: function scrollTop(value) {
                if (arguments.length) {
                    isProxyScrolling = true; // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
                    setProp(-value);
                    setScroll(value);
                    return;
                }
                return -getProp("y");
            },

            scrollHeight: function scrollHeight() {
                return document.body.scrollHeight;
            },
            getBoundingClientRect: function getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            }
        });

        return ScrollTrigger.create({
            animation: gsap.fromTo(content, { y: 0 }, {
                y: function y() {
                    return document.documentElement.clientHeight - height;
                },
                ease: "none",
                onUpdate: ScrollTrigger.update
            }),
            scroller: window,
            invalidateOnRefresh: true,
            start: 0,
            end: refreshHeight,
            refreshPriority: -999,
            scrub: smoothness,
            onUpdate: function onUpdate(self) {
                if (isProxyScrolling) {
                    killScrub(self);
                    isProxyScrolling = false;
                }
            },
            onRefresh: killScrub // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
        });

    }
    
	var smoothScroll = (function () {

        if( $(window).width() >= 960 ){
            var $container = $("#scroll-container")[0];
            smoothScroll($container);
        }
		
	}());
    
    function goToSection(section,space) {
        
        if( $(window).width() >= 960 ){

            space = space || 0;

            if ( space && space.indexOf('%') >= 0){
                space = space.replace('%','');
                space = ($(window).height() / 100) * space;
            }

            var $container = $("#scroll-container");
            var offset = gsap.getProperty($container[0], "y");
            var nextPosition = section[0].getBoundingClientRect().top - offset - space;
            gsap.to(window, { scrollTo: nextPosition, ease: "power4",  overwrite: true});
            
        }else{
            $('html, body').stop().animate({
				'scrollTop': section.offset().top - $('header').outerHeight()
			}, 1200, 'swing');
        }
        
    }
    
    var goToBtn = (function(){
        
        var $btns = $('[data-scrollto]');
        
        if (!$btns.length) { return; }

        $btns.click(function(){
            
            var target = $(this).data('scrollto');
            
            if( $(target).length ){
                goToSection($(target));
            }
            
        });
        
    }());

    //Global function to toggle simple accordions
    var Accordions = (function () {
        var $accordions = $('.accordion');
        if (!$accordions.length) { return; }
        $accordions.each(function () {
            if ($(this).hasClass('active')) {
                $(this).find('.accordion__content').show();
            }
        });
        $accordions.find('.accordion__trigger').click(function (e) {
            var $this = $(this);
            var $accordion = $this.parent();
            var $content = $accordion.find('.accordion__content');
            var $siblings = $accordion.siblings();

            if ($accordion.hasClass('active')) {
                $accordion.removeClass('active');
                $content.slideUp('fast');
            } else {
                $accordion.addClass('active');
                $siblings.removeClass('active').find('.accordion__content').slideUp('fast');
                $content.slideDown('fast');
            }
        })
    }());

    //Global function top open / close lightboxes
    var PDMLightbox = (function () {
        //Lightbox reset - This lightbox is empty and present on all pages
        var $lightbox = $('.pdm-lightbox--reset');
        //it's content can be filled from various sources
        //after close, the content is wiped
        var $lightbox_content = $('.pdm-lightbox--reset .pdm-lightbox__content');
        $('body').on('click', '[data-lightbox-iframe],[data-lightbox-content],[data-lightbox-target],.lightbox-trigger', function (e) {
            e.preventDefault();
            var iframe = $(this).data('lightbox-iframe');
            if (iframe) {
                var youtubePattern = /(?:http?s?:\/\/)?(?:www\.)?youtu(be\.com\/|\.be\/)(embed\/(.+)(\?.+)?|watch\?v=(.+)(\&.+)?)/g;
                var vimeoPattern = /(?:http?s?:\/\/)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/g;
                if (youtubePattern.test(iframe)) {
                    classes += ' youtube-vid'
                    replacement = '<div class="spacer"><iframe width="560" height="315" frameborder="0" allowfullscreen src="//www.youtube.com/embed/$3?rel=0&autoplay=1&modestbranding=1&iv_load_policy=3" /></div>';
                    iframe = iframe.replace(youtubePattern, replacement);
                }
                if (vimeoPattern.test(iframe)) {
                    classes += ' vimeo-vid'
                    replacement = '<div class="spacer"><iframe width="560" height="315" frameborder="0" allowfullscreen src="//player.vimeo.com/video/$3?rel=0&autoplay=1&modestbranding=1&iv_load_policy=3" /></div>';
                    iframe = iframe.replace(vimeoPattern, replacement);
                }
                $lightbox_content.html('<div class="video-embed">' + iframe + '</div>');
            } else {
                if ($(this).data('lightbox-content')) {
                    var content = $(this).data('lightbox-content');
                } else if ($(this).data('lightbox-target')) {
                    var target = $(this).data('lightbox-target');
                    var content = $('#' + target).html();
                } else {
                    var content = $(this).next('.lightbox-content').html();
                }
                $lightbox_content.html(content);
            }
            var classes = $(this).data('lightbox-classes');
            $lightbox.addClass('active').addClass(classes);
        });
        function closeModal($lightbox) {
            $lightbox.removeClass('active');
            $('body').removeClass('noScroll');
            //wait before removing classes till lightbox closses
            if ($lightbox.hasClass('pdm-lightbox--reset')) {
                setTimeout(function () {
                    $lightbox.find('.pdm-lightbox__content').empty();
                    $lightbox.attr('class', 'pdm-lightbox pdm-lightbox--reset');
                }, 750);
            }
        }
        function openModal($lightbox) {
            $lightbox.addClass('active');
            $('body').addClass('noScroll');
        }
        function updateModal($lightbox, $content) {
            $lightbox.find('.pdm-lightbox__content').html($content);
        }
        $('.pdm-lightbox').on('click', function (e) {
            if (e.target == this) {
                closeModal($(this));
            }
        });
        $('.pdm-lightbox__close').click(function (e) {
            e.stopPropagation();
            closeModal($(this).closest('.pdm-lightbox'));
        });
        return {
            close: closeModal,
            open: openModal,
            update: updateModal
        };
    }());
	
	var desktopQuery = window.matchMedia('(min-width: 960px)');
	
	var navigation = (function(){
		
		var $body = $('body');
		var $header = $('.gheader');
		var $burgerMenu = $header.find('.menu-burger');
		
		var $nav = $header.find('.menu--main');
		
		var $overlay = $('.nav-overlay'),
		$path = $('.nav-overlay-path'),
		start2 = "M 0 50 V 0 H 100 V 50 C 100 50 50 100 0 50 z",
		start3 = "M 0 100 V 0 H 100 V 100 C 100 100 50 50 0 100 z",
		end2 = "M 0 100 V 0 H 100 V 100 C 100 100 50 100 0 100 z",
		end3 = "M 0 0 V 0 H 100 V 0 C 100 0 50 0 0 0 z";
		
		gsap.to($('.gheader'), {
			delay:1.5,
			duration: 1,
			opacity: 1
		});

		function openNav(){
			
			console.log('opening-nav');
			
			var ntl = gsap.timeline({
				paused:false,
				onComplete: function () {
					$burgerMenu.removeClass('disabled');
				}
			});

			ntl.to($overlay,{
				duration: 0,
				visibility: 'visible',
			});

			ntl.to($nav,{
				duration: 0,
				visibility: 'visible',
			});

			ntl.to($path[0],{
				duration: .4,
				attr: {
					d: start2
				},
				ease: Power2.easeIn
			});

			ntl.to($path[0], {
				duration: .6,
				attr: {
					d: end2
				},
				ease: Power2.easeOut
			},'end');
			
			ntl.to($nav.find('li'), {
				y: 0,
				opacity: 1,
				stagger: 0.05,
				duration: .5,
				delay:.3,
				ease: Power1.inOut
			},'end');

		};

		function closeNav(){
			
			console.log('closing-nav');
			
			var ntl = gsap.timeline({
				paused:false,
				onComplete: function () {
					$burgerMenu.removeClass('disabled');
					gsap.set($overlay,{
						visibility: 'hidden',
					});
				}
			});
			
			ntl.to($nav.find('li'), {
				y: 30,
				opacity: 0,
				stagger: 0.05,
				duration: .5,
				ease: Power1.easeInOut,
				onComplete: function () {
					gsap.set($nav,{
						visibility: 'hidden',
					});
				}
			},'start');

			ntl.to($path[0], {
				delay:.3,
				duration: .5,
				attr: {
					d: start3
				},
				ease: Power2.easeIn
			},'start');

			ntl.to($path[0], {
				duration: .4,
				attr: {
					d: end3
				},
				ease: Power2.easeOut
			});

		};


		var BurgerMenu = (function () {
			
			var $text = $burgerMenu.find('.menu-burger__text');

			function activate() {
				$burgerMenu.addClass('active disabled').attr('title', 'Close');
				$text.text('Close');
				$body.addClass('no-scroll');
				openNav();
			}

			function reset() {
				$burgerMenu.addClass('disabled');
				$burgerMenu.removeClass('active').attr('title', 'Menu');
				$text.text('Menu');
				$body.removeClass('no-scroll');
				closeNav();
			}

			$burgerMenu.click(function () {
				var $this = $(this);
				if( $this.hasClass('disabled') ){ return false; }
				if ($this.hasClass('active')) { reset(); } else { activate(); }
			});

		}());
		
	}());
	
	var altCursor = (function(){
        
        if( $(window).width() < 960 ){ return; }
		
		var $cursor = $('.alt-cursor');

		gsap.set($cursor, {
			top: '-25px',
			left: '-25px',
//			opacity: 0
		});

		function moveCursor(e) {

			gsap.to($cursor, {
				overwrite: "auto",
                x: e.clientX,
                y: e.clientY,
                ease: "none",
				duration: .2,
			});
			
		};

        $('body').on('mousemove', moveCursor);					
		
	}());
    
    function splitWords($el){
        var sentence = $el.text();
        var words = sentence.split(' ');
        var spanWords = [];
        
        $(words).each(function (i, word) {
            if ($.trim(word).length) {
                word = word;
                var span = $('<span class="curtain">');
                span.append($('<span class="word">'));
                span.find('.word').text(word).prepend('\xA0');
                if( i == 2 ){
                    span.find('.word').addClass('serif');
                }
                if(word.indexOf('●') >= 0 ){
                    span.find('.word').addClass('dotSymbol');
                }
                spanWords.push(span)
            }
        });

        $el.html(spanWords)
    }
	
	var homeHero = (function(){
        
        var $hero = $('.centered-hero');
        
        if( !$hero.length ){ return; }
        
        window.scrollTo(0, 0);
        
        if( $(window).width() < 960 ){
            $hero.css({ 'min-height': $(window).height() });
            refreshSmooth.init();
        }
        
        var $heading = $hero.find('h1');

        splitWords($heading);
		
        var mtl = gsap.timeline({
            repeat:false,
            defaults: {
                duration: 1,
            }
        });
        
        $('body').addClass('no-scroll');
        
        mtl.to('.centered-hero__content .word',{
            y:0,
            opacity:1,
            duration: 1,
            stagger:.15,
			ease: Power2.easeInOut,
		});
        
        mtl.to('.centered-hero__content button',{
            y:0,
            opacity:1,
            duration: 1,
            stagger:.15,
			ease: Power2.easeInOut,
            onComplete: function(){ $('body').removeClass('no-scroll'); },
		},'reveal');
        
        mtl.to('.centered-hero__reveal',{
            opacity:1,
            deration:.5,
			ease: Power2.easeInOut,
		},'reveal');
        
        mtl.to('.centered-hero__reveal',{
            width:'100%',
            delay:.25,
			ease: Power2.easeInOut,
		},'reveal');
        
        mtl.to('.centered-hero__reveal',{
            height:'100%',
			ease: Power2.easeInOut,
		},'reveal2');
        
        mtl.to('.centered-hero__video .spacer',{
            delay:.2,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
			ease: Power2.easeInOut,
		},'reveal2');
        
        mtl.to('.centered-hero__reveal',{
            backgroundColor: 'transparent',
			duration:0,
		});
        
        var $projects = $('.projects');
        
        ScrollTrigger.create({
            trigger: $hero,
            start: 'bottom bottom-=50px',
            endTrigger: $projects,
            end: 'top top',
//            markers:true,
            onEnter: function(){ if( $(window).width() >= 960 ){ goToSection( $projects, '-10' ); } },
            onEnterBack: function(){ if( $(window).width() >= 960 ){ goToSection( $hero ); } },
//            onEnter: function(){ goToSection( $projects, '-10' ); },
//            onEnterBack: function(){ goToSection( $hero ); },
        });
        
        var video3D = (function(){
            
            if( $(window).width() < 960 ){ return; }
            
            var request = null;
            var mouse = { x: 0, y: 0 };
            var cx = window.innerWidth / 2;
            var cy = window.innerHeight / 2;

            $('body').mousemove(function(event) {

                mouse.x = event.pageX;
                mouse.y = event.pageY;

                cancelAnimationFrame(request);
                request = requestAnimationFrame(update);	
            });

            function update() {
                dx = mouse.x - cx;
                dy = mouse.y - cy;
                tiltx = (dy / cy);
                tilty = - (dx / cx);
                radius = Math.sqrt(Math.pow(tiltx,2) + Math.pow(tilty,2));
                degree = (radius * 30);
                gsap.to(".centered-hero__video", 1, {transform:'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)', ease:Power2.easeOut});
            }
	
            $(window).resize(function() {
                cx = window.innerWidth / 2;
                cy = window.innerHeight / 2;
            });	
            
        }());
		
	}());
    
    var projects = (function(){
        
        var $projects = $('.projects .project');
        
        if( !$projects.length ){ return; }
        
        var $projectLinks = $('.projects .project a');
        var currentImage;
        var reversed = true;
        
        function randomIntFromInterval(min, max) { // min and max included 
          return Math.floor(Math.random() * (max - min + 1) + min)
        }
        
        function pauseTimeline(tl){
            if ( tl.paused() ) {
                if( tl.reversed() ){
                    tl.reverse();
                }else{
                    tl.play();
                }
            } else {
                tl.pause();
            }
        }
        
        $projectLinks.each(function(){
            
            var $this = $(this);
            
            splitWords($this);
            
            if( $(window).width() >= 960 ){
                var clone = $this.clone();
                $(clone).find('.curtain').addClass('clone');
                $this.append($(clone).html());
            }
            
            var $words = $this.find('.curtain');
            
            var speed = (randomIntFromInterval(25, 50)/100);
            speed = .5;
            if( reversed == true ){
                reversed = false;
            }else{
                reversed = true;
            }
                        
            var loop = horizontalLoop($words, {paused: false,repeat:-1, speed:speed,reversed:reversed});
            
            $this.mouseenter(function(){
                pauseTimeline(loop)
            });
            $this.mouseleave(function(){
                pauseTimeline(loop)
            });
            
        });
        
        if( $(window).width() < 960 ){ return; }
		
		$projects.mouseleave(function(){
			$('.alt-cursor .portfolio-cursor').css('visibility', 'hidden');
			$('.alt-cursor .basic').show();
		});
        
        $projects.mouseenter(function() {
            
			$('.alt-cursor .basic').hide();
			$('.alt-cursor .portfolio-cursor').css('visibility', 'visible');
			
			var hoverImage = $(this).data('image');
			
			if( hoverImage == currentImage ){ return; }
			
			currentImage = hoverImage;
            
            var props = {
                parent: document.querySelector('.alt-cursor .portfolio-cursor .positioner'),
                intensity: 0.2,
                displacementImage: 'https://powerdigitalmarketing.com/wp-content/uploads/2021/12/diss.png',
                imagesRatio: 683 / 1024,
                hover:false,
            }
			
			if( $('.alt-cursor .portfolio-cursor canvas').length ){
				
				var removeEl = $('.alt-cursor .portfolio-cursor canvas');
                
                props['image1'] = currentImage;
                props['image2'] = hoverImage;
				
				var currentPort = new hoverEffect(props);
				
				setTimeout(function() {
					removeEl.remove();
					currentPort.next();
				}, 100);
				
			}else{
                
                props['image1'] = hoverImage;
                props['image2'] = hoverImage;
				
				new hoverEffect(props);
				
			}

		});
        
    }());
    
    var loopBtns = (function(){
        
        var $btns = $('.loop-btn');
        
        if( !$btns.length ){ return; }
                
        $btns.each(function(){
            
            var $this = $(this);
            
            splitWords($this);
            
            var clone = $this.clone();
            $(clone).find('.curtain').addClass('clone');
            $this.append($(clone).html());
            
            var $words = $this.find('.curtain');
            
            horizontalLoop($words, {paused: false,repeat:-1, speed:.25})
            
        });
        
    }());
    
    var parallaxItems = (function(){
        
        $parallax = $('.parallax-item');
        
        if( !$parallax.length ){ return; }
        
        gsap.to('.callout__gradient',{
            opacity:1,
            duration:5,
            delay:1,
            scrollTrigger:'.callout__gradient',
        });
        
        if( $(window).width() < 960 ){ return; }
        
        document.addEventListener("mousemove", parallax);
        
        function parallax(event) {

            $parallax.each(function(){

                var $this = $(this);
                var position = $this[0].getAttribute("value");
                var x = (window.innerWidth - event.pageX * position) / 90;
                var y = (window.innerHeight - event.pageY * position) / 90;
                $this[0].style.transform = 'translateX('+x+'px) translateY('+y+'px)';

            });

        }

    }());
    
    var latestPosts = (function(){
        
       $slider = $('.latest-posts__loop');
        
       if( !$slider.length ){ return; }
        
        $slider.flickity({
            freeScroll: true,
            contain: true,
            prevNextButtons: false,
            pageDots: false
        });
        
        var $posts = $('.latest-posts__loop').find('.post-card');
        var $postsImage = $posts.find('.post-card__thumb');
        var $postsContent = $posts.find('.post-card__content');
        
        ScrollTrigger.matchMedia({
            "(min-width: 960px)": function () {

                gsap.to($postsImage, {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    stagger:.1,
                    duration:.5,
                    scrollTrigger: {
                        trigger: $slider,
                        start: 'top center+=20%',
                        markers:true,
                    }
                });

                gsap.to($postsContent, {
                    opacity:1,
                    y:0,
                    stagger:.1,
                    delay:.25,
                    scrollTrigger: {
                        trigger: $slider,
                        start: 'top center+=15%',
                        markers:true,
                    }
                });
                    
                    
            }
        });
        
    }());
	
	refreshSmooth.init();

});