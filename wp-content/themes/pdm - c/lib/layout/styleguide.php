<?php if (!is_user_logged_in()) { auth_redirect(); exit; }
	get_header();
?>
<div class="styleguide">
    <?php  if( have_rows('flexible_content', 'option') ){
		$fciN = 0;
		while ( have_rows('flexible_content', 'option') ){ the_row();
			$layout = get_row_layout();

			$classList = array(str_replace('_', '-', $layout));
			include locate_template( 'lib/flexible/'.$layout.'.php', false, false );
		}
	} ?>
</div>

<?php get_footer(); ?>