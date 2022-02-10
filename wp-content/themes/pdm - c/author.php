<?php get_header();
	$author_id = get_the_author_meta('ID');
	$author = 'user_'.$author_id;
	$author_name = get_the_author_meta('display_name');
	$author_bio = get_the_author_meta('user_description');
?>

<section class="author-bio">
    <div class="container">
        <div class="the-content">
            <div class="container">
                <h1><?php echo $author_name?></h1>
                <p><?php echo $author_bio; ?></p>
            </div>
        </div>
    </div>
</section>

<section class="author-posts">
    <div class="container">
        <span class="preheading">By Author</span>
        <h2>Articles</h2>
        <div class="blog-posts">
            <?php if( have_posts() ):
                while( have_posts() ): the_post();
                    get_template_part('lib/parts/post-card');
                endwhile;
	        else : ?>
            <h2>No Posts Found</h2>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>