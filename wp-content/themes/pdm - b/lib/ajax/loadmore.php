<?php
	add_action( 'wp_ajax_nopriv_load_more_posts', 'load_more_posts' );
	add_action( 'wp_ajax_load_more_posts', 'load_more_posts' );
	function load_more_posts(){
		// prepare our arguments for the query
		$args = json_decode( stripslashes( $_POST['query'] ), true );
		$args['paged'] = $_POST['page'] + 1; // we need next page to be loaded
		$args['post_status'] = 'publish';

		// it is always better to use WP_Query but not here
		query_posts( $args );

		if( have_posts() ) :

			// run the loop
			while( have_posts() ): the_post();
				get_template_part( 'lib/parts/post-card' );
			endwhile;

		endif;
		die; // here we exit the script and even no wp_reset_query() required!
	}
?>