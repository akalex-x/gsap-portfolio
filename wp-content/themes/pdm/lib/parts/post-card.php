<?php
    $thumbnail_id = get_field('blog_default_thumbnail', 'option')['ID'];

    $index = $args['index'];

    if(!empty(get_post_thumbnail_id())) $thumbnail_id = get_post_thumbnail_id();

    $feat_img = getIMG($thumbnail_id, 'post');
    $permalink = get_the_permalink();
    $term_list = wp_get_post_terms($post->ID, 'category', ['fields' => 'all']);
    $category;
    foreach($term_list as $term) {
       if( get_post_meta($post->ID, '_yoast_wpseo_primary_category',true) == $term->term_id ) {
         // this is a primary category
            $category = $term;
       }
    }
?>

<article class="post-card">
    <div class="post-card__meta">
        <span class="post-card__date"><?php echo get_the_date('m/d/Y'); ?></span>
        <a class="post-card__category" href="/blog/category/<?php echo $category->slug; ?>"><?php echo $category->name; ?></a>
    </div>
    <a class="post-card__thumb" href="<?php echo $permalink; ?>">
        <?php echo $feat_img; ?>
    </a>
    <div class="post-card__content">
        <h3><a href="<?php echo $permalink; ?>"><?php the_title(); ?></a></h3>
        <a class="arrow-button arrow-button--right" href="<?php echo $permalink; ?>"><span class="circle"></span><?php echo getSVG('down-arrow'); ?></a>
    </div>
</article>