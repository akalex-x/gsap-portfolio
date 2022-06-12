<?php
    global $isHome, $isBlog, $is404, $isSingle, $post_id, $post_type, $isPTArchive, $isCategory, $site_logo;

    $header = get_field('header', 'option');
    $isHome = is_front_page();
    $is404 = is_404();
    $isBlog = is_home();
    $isSingle = is_single();
    $isPTArchive = is_post_type_archive();
    $isCategory = is_category() || is_tax();
    $isArchive = is_archive();

    $post_id = $isBlog ? get_option('page_for_posts') : get_the_ID();
    $post_type = $isPTArchive ? 'cpt_' . get_post_type() : get_post_type();
?>

<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>

<head>
       
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
    
    <?php if($isSingle && $post_type == 'post'){ ?>
        <meta property="og:image" content="<?php echo get_the_post_thumbnail_url($post_id,'hero'); ?>" />
    <?php }else{ ?>
    <?php } ?>
    
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/dist/favi/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/dist/favi/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/dist/favi/favicon-16x16.png">
    <link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/dist/favi/site.webmanifest">
    <link rel="mask-icon" href="<?php echo get_template_directory_uri(); ?>/dist/favi/safari-pinned-tab.svg" color="#ff4b00">
    <meta name="msapplication-TileColor" content="#ff4b00">
    <meta name="theme-color" content="#ff4b00">

    <?php wp_head(); ?>
    
    <script>var ajaxURL = "<?php echo esc_url( home_url( '/' ) ) . 'wp-admin/admin-ajax.php' ?>";</script>
    <?php echo get_field('head_scripts', 'option'); ?>
</head>

<body id="top" <?php body_class(); ?>>
    <?php echo get_field('body_scripts_top', 'option'); ?>
    <?php include locate_template( 'lib/layout/header.php' ); ?>

   	<div id="viewport">
    <main id="scroll-container">