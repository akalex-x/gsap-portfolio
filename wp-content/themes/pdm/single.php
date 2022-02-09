<?php get_header(); ?>

<section class="page-content">
    <div class="container">
       
        <?php if( have_posts() ): ?>
           <?php while( have_posts() ): the_post(); ?>
               
                <?php the_content(); ?>
                
            <?php endwhile; ?>
        <?php endif; ?>
        
    </div>
</section>

<?php get_footer(); ?>