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
    
    var smoothScroll = (function () {

        if( $(window).width() >= 960 ){
            var $container = $("#scroll-container")[0];
            gsapSmoothScroll($container);
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
                var span = $('<div class="curtain">');
                span.append($('<div class="word">'));
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
    
    function ajaxPrep($internalLinks){
        
        var $body = $('body');
        var $main = $('main');
        var $header = $('header');

        $body.addClass('no-scroll');

        var ajaxStart = gsap.timeline({
            repeat:false,
            defaults: {
                duration: 1,
            }
        });

        ajaxStart.to($main,{
            opacity:0,
            onComplete: function(){
                $internalLinks.off();
                $main.empty();
                $body.addClass('ajax-ready');
            },
        },'start');

    }
    
    function ajaxMeta(response,url){
        var title = $(response).filter('title').text();
        window.history.pushState("", title, url);
        $('title').text(title);
    }
    
    function ajaxMain(response){
        
        var ajaxed = setInterval(function(){
            
            if( $('body').hasClass('ajax-ready') ){
                
                clearInterval(ajaxed);
                
                var $body = $('body');
                var $main = $('main');
                var $header = $('header');
                
                $body.removeClass('no-scroll');
                $body.removeClass('ajax-ready');
                
                window.scrollTo(0, 0);
                
                var parser = new DOMParser();
                doc = parser.parseFromString(response, "text/html");
                var bodyClass = doc.body.getAttribute('class');
                parser = doc = null;
                
                console.log(bodyClass);
                
                $body.attr('class',bodyClass);
                
                var main = $(response).find('main').clone();
                $main.append(main);
                
                
                gsap.to($main,{
                    opacity:1,
                    delay:.25,
                });
                
                LazyLoading.update();
                
                initSite();
                
            }
            
        },50);
        
    }
    
    function spin3D($el){ 

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
            gsap.to($el, 1, {transform:'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)', ease:Power2.easeOut});
        }

        $(window).resize(function() {
            cx = window.innerWidth / 2;
            cy = window.innerHeight / 2;
        });	

    }
    
    function initSite(){
        
        var ajaxPage = (function(){
            
            var siteURL = document.location.origin;
            
            var $internalLinks = $("a[href^='"+siteURL+"'], a[href^='/'], a[href^='./'], a[href^='../'], a[href^='#']");

            $internalLinks = $internalLinks.not(function () {
              return $(this).attr('href').match(/\.(pdf|mp3|jpg|jpeg|etc)$/i);
            });

            $internalLinks = $internalLinks.not(function () {
              return $(this).attr('href').match(/wp-admin/);
            });
            
            console.log('ajaxubg');
            
            $internalLinks.click(function(e){
                
                console.log('clicked');
               
                e.preventDefault();
                
                var $this = $(this);
                
                $('.alt-cursor .portfolio-cursor').css('visibility', 'hidden');
                $('.alt-cursor .basic').show();
                
                ajaxPrep($internalLinks);
                    
                var url = $this.attr('href');
                 
                 console.log(url);
                 

                $.ajax({
                    type: 'GET',
                    dataType: 'html',
                    url: url,
                    success: function (response) {

                 console.log(url);
                        ajaxMeta(response,url);
                        ajaxMain(response);

                    }
                });
                    
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

                document.fonts.ready.then(function () {
                    var loop = horizontalLoop($words, {paused: false,repeat:-1, speed:.25});
                });

            });

        }());
	
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

            mtl.set($heading,{
                opacity:1,
            });

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
            });
            
            if( $(window).width() < 960 ){ return; }
            
            spin3D($('.centered-hero__video'));

        }());

        var projects = (function(){

            var $projects = $('.projects .project');

            if( !$projects.length ){ return; }

            var $projectLinks = $('.projects .project a');
            var reversed = true;
            var currentImage;

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

            document.fonts.ready.then(function () {

                $projectLinks.each(function(){

                    var $this = $(this);

                    splitWords($this);

                    if( $(window).width() >= 960 ){
                        var clone = $this.clone();
                        $(clone).find('.curtain').addClass('clone');
                        $this.append($(clone).html());
                    }

                    var $words = $this.find('.curtain');

                    reversed = !reversed;

                    var loop = horizontalLoop($words, {paused: false,repeat:-1, speed:.5,reversed: reversed });

                    $this.mouseenter(function(){
                        pauseTimeline(loop)
                    });

                    $this.mouseleave(function(){
                        pauseTimeline(loop)
                    });

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

        var parallaxItems = (function(){

            var $parallax = $('.parallax-item');

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
                    var position = $this.data('speed');
                    var x = (window.innerWidth - event.pageX * position) / 90;
                    var y = (window.innerHeight - event.pageY * position) / 90;
                    $this[0].style.transform = 'translateX('+x+'px) translateY('+y+'px)';
                });
            }

        }());

        var latestPosts = (function(){

           var $slider = $('.latest-posts__loop');

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

            gsap.to($postsImage, {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                stagger:.1,
                duration:.5,
                scrollTrigger: {
                    trigger: $slider,
                    start: 'top bottom-=25%',
    //                markers:true,
                }
            });

            gsap.to($postsContent, {
                opacity:1,
                y:0,
                stagger:.1,
                delay:.25,
                scrollTrigger: {
                    trigger: $slider,
                    start: 'top bottom-=25%',
    //                markers:true,
                }
            });

        }());
        
        var projectHero = (function(){
            
            var $hero = $('.project-hero');
            var $image = $hero.find('.project-hero__image');

            if( !$hero.length ){ return; }
            
            var $loops = $hero.find('.basic-marquee');
            var reversed = true;
            
            document.fonts.ready.then(function () {

                $loops.each(function(){

                    var $this = $(this);

                    splitWords($this);

                    var clone = $this.clone();
                    $(clone).find('.curtain').addClass('clone');
                    $this.append($(clone).html());

                    var $words = $this.find('.curtain');

                    reversed = !reversed;

                    var loop = horizontalLoop($words, {paused: false,repeat:-1, speed:.5,reversed: reversed });

                });

            });
            
            var $reveal = $hero.find('.project-hero__reveal');
            
            var phtl = gsap.timeline({
                repeat:false,
                delay:1,
                defaults: {
                    duration: 1,
                }
            });
            
            phtl.to($reveal,{
                opacity:1,
                deration:.5,
                ease: Power2.easeInOut,
            },'reveal');

            phtl.to($reveal,{
                width:'100%',
                delay:.25,
                ease: Power2.easeInOut,
            },'reveal');

            phtl.to($reveal,{
                height:'100%',
                ease: Power2.easeInOut,
            },'reveal2');

            phtl.to($image.find('.positioner'),{
                delay:.2,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                ease: Power2.easeInOut,
            },'reveal2');

            phtl.to($reveal,{
                backgroundColor: 'transparent',
                duration:0,
            });
            
            if( $(window).width() < 960 ){ return; }
            
            spin3D($image);

        }());
        
        refreshSmooth.init();
        
    };
    
	initSite();

});