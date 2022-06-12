<?php
    $thumbnail_id = get_field('blog_default_thumbnail', 'option')['ID'];

    $index = $args['index'];

    if(!empty(get_post_thumbnail_id())) $thumbnail_id = get_post_thumbnail_id();

    $feat_img = getIMG($thumbnail_id, 'post');
    $permalink = get_the_permalink();
?>

<article class="post-card">
    <a class="post-card__thumb" href="<?php echo $permalink; ?>" draggable="false">
        <div class="positioner"><?php echo $feat_img; ?></div>
    </a>
    <div class="post-card__content">
        <h3><?php the_title(); echo ' ' . $index; ?></h3>
        <p><?php echo excerpt(30); ?></p>
        <a href="<?php echo $permalink; ?>">Read More</a>
    </div>
</article>