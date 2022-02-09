<?php
// disables WP scaled images
add_filter( 'big_image_size_threshold', '__return_false' );

// prevents WP default images from being generated
add_filter('intermediate_image_sizes_advanced', 'pdm_remove_default_image_sizes');
function pdm_remove_default_image_sizes( $sizes) {
	unset( $sizes['thumbnail']);
	unset( $sizes['medium']);
	unset( $sizes['medium_large']);
	unset( $sizes['large']);
	return $sizes;
}

// removes scaled images from being generated
remove_image_size( '1536x1536' );
remove_image_size( '2048x2048' );

//add more image sizes for bigger screens
add_image_size( 'thumb', 200, 0, false);
add_image_size( 'card', 500, 0, false);
add_image_size( 'post', 900, 0, false);
add_image_size( 'large', 1400, 0, false);
add_image_size( 'hero', 2000, 0, false);

// adds custom image sizes to dropdowns
add_filter('image_size_names_choose', 'pdm_image_size_names');
function pdm_image_size_names( $sizes ) {
	$sizes['thumb'] = __( 'Thumb' );
	$sizes['card'] = __( 'Card' );
	$sizes['post'] = __( 'Post' );
	$sizes['large'] = __( 'Large' );
	$sizes['hero'] = __( 'Extra Large' );
	return $sizes;
}

//Pass in the image id, max width in pixels if wanted or else pass false, and alt tag if wanted.
function getIMG($id, $size = "post", $return_src = false, $img_attr = array()) {
	$default_attr = array('loading' => 'lazy');
	$attr = array_merge($default_attr, $img_attr);
	$img_src = wp_get_attachment_image_src($id, $size)[0];
	$img_srcset = array();

	if(isset($attr['lazy']) && $attr['lazy'] == false){
		$attr['loading'] = false;
		unset($attr['lazy']);
	}

	$image_sizes = wp_get_additional_image_sizes();
	$size_index = array_search($size ,array_keys($image_sizes))+1;
	$srcset_sizes = array_splice($image_sizes, 0, $size_index);

	foreach($srcset_sizes as $ss_size => $val) {
		$meta = wp_get_attachment_image_src( $id, $ss_size );
		$img_srcset[] = $meta[0] . ' ' . $meta[1] .'w';
	}

	$str_srcset = join(', ', $img_srcset);
	$attr['srcset'] = $str_srcset;

	if($return_src == true){
		$bgIMG = $img_src;
		return 'data-bg="'.$bgIMG.'"';
	} else {
		if($attr['loading'] == 'lazy'){
			$attr['src'] = '';
			$attr['srcset'] = ' '; // space needs to be here in order to be empty on tag, not sure why
			$attr['data-src'] = $img_src;
			$attr['data-srcset'] = $str_srcset;
			$attr['loading'] = false;
			$attr['class'] = 'lazy';
		}

		return wp_get_attachment_image( $id, $size, false, $attr );
	}
}