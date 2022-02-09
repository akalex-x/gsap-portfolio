<?php get_header(); ?>

<section class="archive-content">
    <div class="container">
       
        <div class="blog-posts">
           
            <?php if( have_posts() ): ?>
			   <?php while( have_posts() ): the_post(); ?>
					<?php get_template_part('lib/parts/post-card'); ?>
				<?php endwhile; ?>
			<?php else : ?>
				<h2>No Posts Found</h2>
			<?php endif; ?>
       
        </div>
        
        <?php get_template_part('lib/parts/loadmore'); ?>
        
    </div>
</section>

<?php get_template_part('lib/layout/flexible'); ?>

<?php get_footer(); ?>