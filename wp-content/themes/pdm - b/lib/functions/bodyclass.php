<?php

    add_filter('body_class','browser_body_class');
    function browser_body_class($classes) {
        global $is_lynx, $is_gecko, $is_IE, $is_opera, $is_NS4, $is_safari, $is_chrome, $is_iphone;

        if($is_lynx) $classes[] = 'lynx';
        //firefox = gecko
        elseif($is_gecko) $classes[] = 'gecko';
        elseif($is_opera) $classes[] = 'opera';
        elseif($is_NS4) $classes[] = 'ns4';
        elseif($is_safari) $classes[] = 'safari';
        elseif($is_chrome) $classes[] = 'chrome';
        elseif($is_IE) $classes[] = 'ie';
        else $classes[] = 'unknown';

        if($is_iphone) $classes[] = 'iphone';

        return $classes;
    }

    //Page Slug Body Class
    // function add_slug_body_class( $classes ) {
    //     global $post;
    //     if ( isset( $post ) ) {
    //         $classes[] = $post->post_type . '-' . $post->post_name;
    //     }
    //     return $classes;
    // }
    // add_filter( 'body_class', 'add_slug_body_class' );


    // add category nicenames in body class
    add_filter('body_class', 'category_id_class');
    function category_id_class($classes) {
        if(!is_category( )) return $classes;

        $queried = get_queried_object();
        $exclude = array(
            'category-'.$queried->term_id,
        );

        $classes = array_diff( $classes, $exclude );
        return $classes;
    }

    add_filter('body_class', 'archive_classes');
    function archive_classes($classes) {
        global $post, $isArchive, $isPTArchive;
        if(!$isArchive && !$isPTArchive ) return $classes;

        $classes[] = 'archive-'.$post->post_type;
        return $classes;
    }


    // add category nicenames in body class
    add_filter('body_class', 'page_post_classes');
    function page_post_classes($classes) {
        global $post, $isBlog, $isHome;

        $template = str_replace(array('templates/','.php'), array('',''), get_page_template_slug($post->ID));
        if(empty($template)) $template = 'default';

        if(is_singular()) {
            if($post->post_type != 'page') $classes[] = 'single-post';
            $classes[] = 'single-'.$post->post_type;
        }

        if(!$isHome && $post->post_type === 'page') {
            $classes[] = 'template-'.$template;
        }

        return $classes;
    }

    add_filter('body_class', 'reset_classes');
    function reset_classes($classes){
        global $post, $isArchive, $isPTArchive;

        $template = str_replace(array('templates/','.php'), array('',''), get_page_template_slug($post->ID));
        if(empty($template)) $template = 'default';

        $exclude = array(
            'page',
            'page-template',
            'page-template-'.$template,
            'page-template-templates',
            'page-template-templates'.$template.'-php',
            'page-id-'.$post->ID,
            'single',
            'admin-bar',
            'logged-in',
            'single-format-standard',
            'postid-'.$post->ID,
            'post-template-'.$template,
            'template-default',
            'privacy-policy',
            'post-type-archive',
            'post-type-archive-'.$post->post_type,
            $post->post_type.'-template-default'
        );

        $classes = array_diff( $classes, $exclude );
        if(!$isArchive && !$isPTArchive) $classes[] = 'pid-'.$post->ID;
        return $classes;

    }