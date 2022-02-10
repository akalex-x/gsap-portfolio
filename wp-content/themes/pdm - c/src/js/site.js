document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, "") + "js"

if (window.location.hash) { setTimeout(function () { window.scrollTo(0, 0); }, 2); }

jQuery(document).ready(function ($) {

    /*-----------------------------------------------------------------------------GLOBAL ON LOAD----*/

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

    var SmoothScroll = (function () {
        var $anchorLinks = $('a[href^="#"]').not('a[href="#"]');

        $('a[href="#"]').click(
            function (e) { e.preventDefault(); return; }
        );

        function goTo(target) {
            if (target === "" || !$(target).length) { return; }
            var scrollPos = typeof target === 'number' ? target : $(target).offset().top;

            if (window.innerWidth >= 720) {
                scrollPos -= $('header').outerHeight();
            } else {
                scrollPos -= $('header').outerHeight() * 2;
            }

            $('html, body').stop().animate({
                'scrollTop': scrollPos - 32
            }, 1200, 'swing', function () {
                if (typeof target === 'string') {

                    if (window.location.hash) {
                        // window.location.hash = target;
                    }
                }
            });
        }

        if (window.location.hash) {
            setTimeout(function () {
                goTo(window.location.hash);
            }, 500);
        }

        if ($anchorLinks.length) {
            $anchorLinks.on('click', function (e) {
                if (!$("#" + this.hash.replace('#', '')).length) { return; }
                e.preventDefault();
                goTo(this.hash);
            });
        }

        return { to: goTo }
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
	
	var homeHero = (function(){
		
		gsap.registerPlugin(MorphSVGPlugin);
		
		var tl = gsap.timeline({
			paused:false,
			repeat:-1,
//			yoyo:true,
			repeatDelay:1,
			defaults: {
				duration: 1,
			},
		});


		tl.to('#start',{
			morphSVG:{shape:'#title',type:'rotational',origin:"0% 50%"},
		}, '+=1.5');

		tl.to('#start',{
			morphSVG:{shape:'#fun',type:'rotational',origin:"0% 50%"},
		}, '+=1.5');
		
		tl.to('#start',{
			morphSVG:{shape:'#name',type:'rotational',origin:"0% 50%"},
		}, '+=1.5');
		
		tl.play();
		
//		gsap.set(".controls, h1", {visibility:showing ? "visible" : "hidden"});
		
	}());

});