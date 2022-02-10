<?php
    $args = array(
        'post_type' => 'post',
        'post_parent' => 0,
        'showposts' => 3,
    );
    $the_query = new WP_Query( $args );

	$classList[] = 'latest-posts';
	$classes = buildAttr('class', $classList);
?>

<section <?php echo $id; echo $classes ?>>
    <div class="container">
        <div class="intro">
            <h2>The Latest Posts</h2>
            <a href="/blog/">View all posts</a>
        </div>
        <div class="the-news">
            <?php if( $the_query->have_posts() ) :
                while( $the_query->have_posts() ): $the_query->the_post();
                    get_template_part('lib/parts/post-card');
                endwhile;
            endif; ?>
        </div>
    </div>
</section>