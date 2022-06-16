<?php
	/* ========================================================================================================================

	Required external files

	======================================================================================================================== */

	require_once( 'lib/functions/navwalker.php' );
	require_once( 'lib/functions/bodyclass.php' );
    require_once( 'lib/functions/utilities.php' );
    require_once( 'lib/functions/shortcodes.php' );
    require_once( 'lib/functions/acf.php' );
    require_once( 'lib/functions/getimg.php' );
    require_once( 'lib/ajax/loadmore.php' );

	/* ========================================================================================================================

	Theme specific settings

	Uncomment register_nav_menus to enable a single menu with the title of "Primary Navigation" in your theme

	======================================================================================================================== */

	add_theme_support('post-thumbnails');
	add_theme_support('html5');

    register_nav_menus(array(
        'main' => 'Main Menu',
        'foot' => 'Footer Menu',
        'foot_short' => 'Footer - Short Menu'
    ));

	/* ========================================================================================================================

	Actions and Filters

	======================================================================================================================== */

    add_filter('wp_nav_menu', 'do_menu_shortcode');
    function do_menu_shortcode( $menu ){ return do_shortcode( $menu ); }

    add_filter( 'embed_oembed_html', 'wpse_embed_oembed_html', 99, 4 );
    function wpse_embed_oembed_html( $cache, $url, $attr, $post_ID ) {
        $classes = array();
        // Add these classes to all embeds.
        $classes_all = array( 'responsive-container' );
        // Check for different providers and add appropriate classes.

        if ( false !== strpos( $url, 'vimeo.com' ) )  $classes[] = 'vimeo';
        if ( false !== strpos( $url, 'youtube.com' ) || false !== strpos( $url, 'youtu.be' ) ) $classes[] = 'youtube';

        $classes = array_merge( $classes, $classes_all );
        return '<div class="oembed ' . esc_attr( implode( ' ', $classes ) ) . '">' . $cache . '</div>';
    }

    add_filter('the_content', 'wrapIframe');
    function wrapIframe($content) {
        preg_match_all('/\<iframe (.+?)src="(.+?)"(.+?\>)(\<.+?\>)/', $content, $matches);
        if(empty(array_filter($matches))) return $content;

        $iframes = array();

        foreach($matches as $key => $match){
            $iframes[] = wp_list_pluck($matches, $key );
        }

        if(empty(array_filter($iframes))) return $content;

        foreach($iframes as $iframe) {
            $new_iframe = '<div class="video-embed"><iframe class="lazy" '.$iframe[1].' src="" data-src="'.$iframe[2].'" '.$iframe[3]."". $iframe[4].' </div>';
            $content = str_replace($iframe[0], $new_iframe, $content);
        }
        return $content;
     }

	/* ========================================================================================================================

	Scripts

	======================================================================================================================== */
//    add_action( 'wp_enqueue_scripts', 'wp_script_object' );
//    function wp_script_object() {
//        global $wp_query;
//
//        wp_register_script( 'my_loadmore', null, array('site') );
//        wp_localize_script( 'my_loadmore', 'WP', array(
//            'posts' => json_encode( $wp_query->query_vars ), // everything about your loop is here
//            'current_page' => get_query_var( 'paged' ) ? get_query_var('paged') : 1,
//            'max_page' => $wp_query->max_num_pages
//        ) );
//
//         wp_enqueue_script( 'my_loadmore' );
//    }

	/**
	 * Add scripts and styles via wp_head()
	 */

	add_action( 'wp_enqueue_scripts', 'pdm_scripts_styles' );
	function pdm_scripts_styles() {
		wp_deregister_script( 'jquery' );
		wp_enqueue_style( 'styles', get_stylesheet_directory_uri().'/dist/main.css', '', '', 'screen' );
		wp_enqueue_script( 'jquery', includes_url( '/js/jquery/jquery.min.js' ), false, NULL );
//		wp_enqueue_script( 'jquery-marquee', 'https://cdn.jsdelivr.net/jquery.marquee/1.4.0/jquery.marquee.min.js', array(), false, true );
//		wp_enqueue_script( 'threejs', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/108/three.min.js', array(), false, true );
//		wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js', array(), false, true );
//		wp_enqueue_script( 'scrollTrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js', array(), false, true );
//		wp_enqueue_script( 'scrollTo', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollToPlugin.min.js', array(), false, true );
//		wp_enqueue_script( 'morph', get_template_directory_uri().'/dist/morph.js', array(), false, true );
		wp_enqueue_script( 'site', get_template_directory_uri().'/dist/bundle.min.js', array( 'jquery' ), false, true );
	}

    add_action( 'wp_default_scripts', 'dequeue_jquery_migrate' );
    function dequeue_jquery_migrate( $scripts ) {
        if ( !is_admin() && !empty( $scripts->registered['jquery'] ) ) {
            $scripts->registered['jquery']->deps = array_diff(
                $scripts->registered['jquery']->deps,
                [ 'jquery-migrate' ]
            );
        }
    }

    add_action( 'wp_print_styles', 'wps_deregister_styles', 100 );
    function wps_deregister_styles() { wp_dequeue_style( 'wp-block-library' ); }

    add_action( 'wp_footer', 'my_deregister_wp_embed' );
	function my_deregister_wp_embed(){ wp_deregister_script( 'wp-embed' ); }

	/**
	* Disable the emoji's
	*/
	add_action( 'init', 'disable_emojis' );
	function disable_emojis() {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
		add_filter( 'wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2 );
	}
	/**
	* Filter function used to remove the tinymce emoji plugin.
	*
	* @param array $plugins
	* @return array Difference betwen the two arrays
	*/
	function disable_emojis_tinymce( $plugins ) {
        if ( is_array( $plugins ) ) return array_diff( $plugins, array( 'wpemoji' ) );

        return array();
	}
	/**
	* Remove emoji CDN hostname from DNS prefetching hints.
	*
	* @param array $urls URLs to print for resource hints.
	* @param string $relation_type The relation type the URLs are printed for.
	* @return array Difference betwen the two arrays.
	*/
	function disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
		if ( 'dns-prefetch' == $relation_type ) {
			/** This filter is documented in wp-includes/formatting.php */
			$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );
			$urls = array_diff( $urls, array( $emoji_svg_url ) );
		}
		return $urls;
	}

    // Update CSS within in Admin
    add_action('admin_enqueue_scripts', 'admin_style');
    function admin_style() {
        wp_enqueue_style('admin-styles', get_template_directory_uri().'/dist/admin.css');
        wp_enqueue_script('admin-scripts', get_template_directory_uri().'/dist/admin.js', ['jquery'], false, true);
    }

    add_action('init', function() {
        $url_path = trim(parse_url(add_query_arg(array()), PHP_URL_PATH), '/');

        switch ($url_path) {
            case 'styleguide':
              $load = locate_template('lib/layout/styleguide.php', true);
            break;
        }
        if ($load) exit(); // just exit if template was found and loaded
    });