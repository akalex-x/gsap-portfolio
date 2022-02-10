document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, "") + "js"

if (window.location.hash) { setTimeout(function () { window.scrollTo(0, 0); }, 2); }

jQuery(document).ready(function ($) {

    /*-----------------------------------------------------------------------------GLOBAL ON LOAD----*/
    
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    var grainyBackground = (function(){
        var grainedOptions = {
            "animate": true,
            "patternWidth": 400,
            "patternHeight": 400,
            "grainOpacity": 0.09,
            "grainDensity": 2,
            "grainWidth": 2,
            "grainHeight": 2
        }
        var grainedOptions2 = {
            "animate": true,
            "patternWidth": 100,
            "patternHeight": 100,
            "grainOpacity": 0.09,
            "grainDensity": 2,
            "grainWidth": 2,
            "grainHeight": 2
        }
        grained("#viewport", grainedOptions);
//        grained("#grainy-vid", grainedOptions2);
    }()); 

    var LazyLoading = (function () {
        
        var instance = new LazyLoad();

        function lazyBGImages() {
            var $bgImages = $('[data-bg]:not(.lazy)');
            if (!$bgImages.length) { return; }

            $bgImages.each(function () {
                $(this).addClass('lazy');
            });
        }

        function update() {
            lazyBGImages();
            instance.update();
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

    var Forms = (function () {
        var InputMasks = (function () {
            var $masks = $('[data-mask]');
            if (!$masks.length) { return; }

            /**
             * Key Codes:
             * 8    - backspace
             * 13   - enter
             * 16   - shift
             * 18   - alt
             * 20   - caps
             * 27   - esc
             * 37   - left arrow
             * 38   - up arrow
             * 39   - right arrow
             * 40   - down arrow
             * 46   - delete
             **/
            var exclude_keys = [8, 13, 16, 18, 20, 27, 37, 38, 39, 40, 46];

            $('[data-mask]').keyup(function (e) {
                console.log(e.keyCode);
                if (exclude_keys.indexOf(e.keyCode) > -1) { return; }

                switch (this.dataset.mask) {
                    case 'digits':
                        var x = this.value.replace(/\D/g, '');
                        this.value = x;
                        break;
                    case 'phone':
                        var x = this.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                        console.log(x);
                        this.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                        break;
                    case 'ssn': {
                        var x = this.value.replace(/\D/g, '').match(/^(\d{0,3})(\d{0,2})(\d{0,4})/);
                        this.value = !x[2] ? x[1] : x[1] + '-' + x[2] + '-' + x[3];
                    }
                }
            });
        }());

        //Plugin used for form validation
        var parselyOptions = {
            classHandler: function (parsleyField) {
                var $element = parsleyField.$element;
                if ($element.parent().hasClass('select-menu')) {
                    return $element.parent();
                }
                return $element;
            },
            errorsContainer: function (parsleyField) {
                var $element = parsleyField.$element;
                var $fieldContainer = $element.closest('.form-field');
                if ($fieldContainer) {
                    return $fieldContainer;
                }
            }
        };

        //Global function to set form state classes
        var formStates = (function () {
            $formInputs = $('form :input');
            if (!$formInputs.length) { return; }

            $formSelectMenus = $('.select-menu select, .ginput_container_select select');

            function isGFormInput($el) {
                return $el.parent().hasClass('ginput_container') ? $el.parent().parent() : $el;
            }

            function setFilled($input) {
                $input.addClass('filled');
            }

            function removeFilled($input) {
                $input.removeClass('filled');
            }

            function setFocused() {
                $(this).addClass('focused');
            }

            function removeFocused() {
                $(this).removeClass('focused');
            }

            function checkInput(e) {
                if (this.type == 'button' ||
                    this.type == 'range' ||
                    this.type == 'submit' ||
                    this.type == 'radio' ||
                    this.type == 'checkbox' ||
                    this.type == 'reset') { return; }

                var $this = $(this);
                var $parent = $this.parent();
                var is_selectMenu = $parent.hasClass('select-menu') || $parent.hasClass('ginput_container_select');

                var $input = is_selectMenu ? $parent : $this;

                switch (this.type) {
                    case 'select-one':
                    case 'select-multiple':
                        if (this.value !== '') {
                            setFilled($input);
                        } else {
                            removeFilled($input);
                        }
                        break;
                    default:
                        if (this.value !== '') {
                            setFilled($input);
                        } else {
                            removeFilled($input);
                        }
                        break;
                }
            }

            $formInputs.each(checkInput);
            $formInputs.on('change', checkInput);
            $formInputs.on('focus', setFocused);
            $formInputs.on('blur', removeFocused);
            $formSelectMenus.on('focus', setFocused);
            $formSelectMenus.on('blur', removeFocused);

        }());
    }());

    //Global function top open / close lightboxes
    var PDMLightbox = (function () {

        var $body = $('body');
        //Lightbox reset - This lightbox is empty and present on all pages
        var $lightbox = $('.pdm-lightbox--reset');

        //it's content can be filled from various sources
        //after close, the content is wiped
        var $lightbox_content = $('.pdm-lightbox--reset .pdm-lightbox__content');

        $body.on('click', '[data-lightbox-iframe],[data-lightbox-content],[data-lightbox-target]', function (e) {

            e.preventDefault();

            var classes = $(this).data('lightbox-classes');
            var iframe = $(this).data('lightbox-iframe');
            var blur = $(this).data('lightbox-blur');

            if (iframe) {

                var youtubePattern = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
                var vimeoPattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;

                if (youtubePattern.test(iframe)) {

                    classes += ' youtube-vid'

                    replacement = '<div class="spacer"><iframe width="560" height="315" frameborder="0" allowfullscreen src="//www.youtube.com/embed/$1?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3" /></div>';

                    iframe = iframe.replace(youtubePattern, replacement);

                }

                if (vimeoPattern.test(iframe)) {

                    classes += ' vimeo-vid'

                    replacement = '<div class="spacer"><iframe width="560" height="315" frameborder="0" allowfullscreen src="//player.vimeo.com/video/$1?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3" /></div>';

                    iframe = iframe.replace(vimeoPattern, replacement);

                }

                $lightbox_content.html('<div class="iframe-wrap">' + iframe + '</div>');

            } else {
                if ($(this).data('lightbox-content')) {
                    var content = $(this).data('lightbox-content');
                } else if ($(this).data('lightbox-target')) {
                    var target = $(this).data('lightbox-target');
                    var content = $('#' + target).html();
                }
                $lightbox_content.html(content);
            }

            if (blur != false) {
                $body.addClass('blur');
            }

            $lightbox.addClass('active').addClass(classes);

        });

        function closeLightbox($lightbox) {
            $lightbox.removeClass('active');
            $('body').removeClass('no-scroll');
            setTimeout(function () {
                $body.removeClass('blur');
            }, 250);
            //wait before removing classes till lightbox closses
            if ($lightbox.hasClass('pdm-lightbox--reset')) {
                setTimeout(function () {
                    $lightbox.find('.pdm-lightbox__content').empty();
                    $lightbox.attr('class', 'pdm-lightbox pdm-lightbox--reset');
                }, 750);
            }
        }

        $('.pdm-lightbox').on('click', function (e) {
            var $lightbox = $(this);
            if (e.target == this) {
                closeLightbox($lightbox);
            }
        });

        $('.pdm-lightbox__close').click(function (e) {
            e.stopPropagation();
            $lightbox = $(this).closest('.pdm-lightbox');
            closeLightbox($lightbox);
        });
        return {
            close: closeLightbox
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
		
		var $cursor = $('.alt-cursor');

		gsap.set($cursor, {
			top: '-25px',
			left: '-25px',
			scale: .5,
			opacity: 0
		});

		function moveCursor(e) {
			
			var x = e.clientX - $('html').offset().left;
			var y = e.clientY - $('html').offset().left;
			x = Math.round(x);
			y = Math.round(y);

			gsap.to($cursor, {
				x: x,
				y: y,
				scale: 1,
				opacity: 1,
				duration: .75
			});
			
		};

		$('body').on('mouseover', function(){
			$('body').on('mousemove', moveCursor);							
		});
		
	}());
	
	var homeHero = (function(){
        
        var $el = $('.centered-hero__content h1');
        var sentence = $el.text();
        var words = sentence.split(' ');
        var spanWords = [];

//        $(words).each(function (i, word) {
//            if ($.trim(word).length) {
//                
//                word = word;
//                var span = $('<span class="curtain">');
//                span.append('<span class="word>');
//                
//                if( i == 2 ){
//                    span.find('.word').addClass('serif');
//                }
//                
//                span.find('.word').text(word).prepend('\xA0');
//                spanWords.push(span)
//                
//            }
//        });
        
        $(words).each(function (i, word) {
            if ($.trim(word).length) {
                word = word;
                var span = $('<span class="curtain">');
                span.append($('<span class="word">'));
                span.find('.word').text(word).prepend('\xA0');
                if( i == 2 ){
                    span.find('.word').addClass('serif');
                }
                spanWords.push(span)
            }
        });
        

        $el.html(spanWords)
		
        var mtl = gsap.timeline({
//            paused:true,
            repeat:false,
            defaults: {
                duration: 1,
            }
        });
        
        mtl.to('.centered-hero__content .word',{
            y:0,
            opacity:1,
            duration: 1,
            stagger:.15,
			ease: Power2.easeInOut,
		});
        
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
        
        var video3D = (function(){
            
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
	
	
//	var smoothScroll = (function () {
//
//		var $container = $("#scroll-container");
//		
//		function goToSection(section) {
//			var offset = gsap.getProperty($container[0], "y");
//			var nextPosition = section[0].getBoundingClientRect().top - offset;
//			gsap.to(window, { scrollTo: nextPosition, ease: "power4",  overwrite: true}) ;
//		}
//		
//		smoothScroll($container);
//		
//		$('.next-section-trigger').click(function(){
//			
//			var $this = $(this);
//			var $parent;
//			
//			if( $this.closest('.pin-spacer').length ){
//				$parent = $(this).closest('.pin-spacer');
//			}else{
//				$parent = $(this).closest('section');
//			}
//			
//			var $nextSection = $parent.next();
//			var offset = gsap.getProperty($container[0], "y");
//			var nextPosition = $nextSection[0].getBoundingClientRect().top - offset;
//			
//			gsap.to(window, { scrollTo: nextPosition, ease: "power4", overwrite: true });
//			
//		});
//		
//	}());
	
	var resizeEvent = window.document.createEvent('UIEvents'); 
	resizeEvent.initUIEvent('resize', true, false, window, 0); 
	window.dispatchEvent(resizeEvent);

});