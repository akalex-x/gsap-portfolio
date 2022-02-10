<?php
    if( !is_home() && !is_category() && !is_post_type_archive() && !is_tax() ){
        $typeOrID = get_the_ID();
    }elseif( is_post_type_archive() ){
        $post_type = get_queried_object()->name;
		$typeOrID = 'cpt_'.$post_type;
		//check if WPML is installed, if so load the content for that language
		if( defined("ICL_LANGUAGE_CODE") ){
			$typeOrID .= '_'.ICL_LANGUAGE_CODE;
		}
    }elseif( is_category() ){
		$typeOrID = get_queried_object();
    }elseif( is_tax() ){
		$typeOrID = get_queried_object();
    }else{
        $typeOrID = get_option('page_for_posts');
    }

    if( have_rows('flexible_content', $typeOrID) ){
        $fciN = 0;
        while ( have_rows('flexible_content', $typeOrID) ){ the_row();
														   
			$layout = get_row_layout();

			$classList = array();
			$modifiers = get_sub_field('modifiers');
		    $id = '';

			if( !empty($modifiers) ){
		    	$id = $modifiers['id'];
				$spacing = $modifiers['spacing'];
				$classList = array_merge($classList, $spacing);
				$classes = explode(' ', $modifiers['classes']);
				$classList = array_merge($classList, $classes);
			}
														   
		   $classes = implode(' ', $classList);
														   
            include locate_template( 'lib/flexible/'.$layout.'.php', false, false );
        }
    }
?>