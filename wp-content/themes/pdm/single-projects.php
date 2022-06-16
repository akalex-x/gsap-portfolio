<?php get_header(); ?>

<?php
    $type = wp_get_post_terms($post->ID, 'project_type', ['fields' => 'all']);
    $category = wp_get_post_terms($post->ID, 'project_category', ['fields' => 'all']);
    $thumbnail_id = get_post_thumbnail_id();
?>

<section class="project-hero">
    
    <h1 class="basic-marquee"><?php echo get_the_title(); ?>  &#9679;</h1>

    <p class="basic-marquee"><?php echo $type[0]->name ?>  &#9679; <?php echo $category[0]->name ?>  &#9679;</p>
    
    <div class="project-hero__image">
        <div class="spacer">
            <div class="project-hero__reveal"></div>
            <div class="positioner">
                <?php
                    $attr = array();
                    $attr['lazy'] = false;
                    echo getIMG($thumbnail_id,'large',false,$attr);
                ?>
            </div>
        </div>
    </div>

</section>

<section class="project-intro">
    <div class="container">
        
        <div class="project-intro__left">
            <?php echo get_field('project_meta'); ?>
            <div class="project-link">
                <a href="<?php echo get_field('project_url'); ?>" target="_blank">View Website</a>
            </div>
        </div>
        
        <div class="project-intro__right">
            <?php echo get_field('project_brief'); ?>
        </div>
        
    </div>
</section>



<?php get_footer(); ?>