<?php /* Template Name: Flexible Content */ ?>

<?php get_header(); ?>


<?php if( have_posts() ) ?>
   <?php while( have_posts() ): the_post(); ?>
               
		<?php get_template_part('lib/layout/flexible'); ?>

	<?php endwhile; ?>
<?php endif; ?>

<?php get_footer(); ?>