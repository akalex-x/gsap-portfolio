<?php

// To use the get popular ids you will first need to create a fucntion that tracks views and saved to meta as 'post_views_count'

function get_related_ids($post_ids, $exclude_ids, $max=5, $post_types = ['post'], $taxonomy='post_tag'){
    
	$debug=false;
	
	$output=[];
	$post_tags=[];
	foreach($post_ids as $id)
	{
		$post_tag = wp_get_object_terms( $id, $taxonomy, ['fields' => 'ids', 'orderby' => 'count', 'order' => 'ASC'] );
		foreach($post_tag as $tag)
		{
			if (!in_array($tag->term_id, $post_tags)) $post_tags[]=$tag;
		}
	}
	if ($debug) print_r($post_tags);
    
    $terms_to_iterate=$post_tags;
    $post_args = array(
        'fields' => 'ids',
        'post_type' => $post_types,
        'post__not_in' => $exclude_ids,
        'tax_query'=>array(
	        array(
	            'taxonomy' => $taxonomy,
	            'field' => 'id',
	            'terms' => $post_tags
	        )
	    )
    );
    
    if ($debug) print_r($post_args);
    $posts = get_posts( $post_args );
    if ($debug) print_r($posts);
    foreach( $posts as $id ) {
       $post_tag = wp_get_object_terms( $id, $taxonomy, ['fields' => 'ids', 'orderby' => 'count', 'order' => 'ASC'] );
       if ($debug) print_r($post_tag);
       $output[$id]=count(array_intersect($post_tags, $post_tag));
    }

    arsort($output);
    
    $output = array_slice(array_keys($output), 0, $max);
    
	 if ($debug) print_r($output);
    
	if (count($output)<$max)
	{
		unset($post_args['tax_query']);
		$post_categories=wp_get_post_categories($post_id);
		if (!empty($post_categories))
		{
			$post_args['category__in']=$post_categories;
			if ($debug) print_r($post_args); 
			$posts = get_posts( $post_args );
	        foreach( $posts as $id ) {
		        if (count($output)>=$max) break;
	            $id = intval( $id );
	            if( !in_array( $id, $output) ) {
	                $output[] = $id;
	            }
	        }
	        if ($debug) print_r($output);
        }
	}
	if (count($output)==0)
	{
		unset($post_args['category__in']);
		if ($debug) print_r($post_args); 
		$posts = get_posts( $post_args );
        foreach( $posts as $id ) {
	        if (count($output)>=$max) break;
            $id = intval( $id );
            if( !in_array( $id, $output) ) {
                $output[] = $id;
            }
        }
        if ($debug) print_r($output);
	}
	return $output;
}

function get_popular_ids($post_id, $max=5, $post_types = ['post'])
{
	$debug=false;
	$output=[];
	$post_args = array(
        'fields' => 'ids',
        'post_type' => $post_types,
        'posts_per_page' => $max,
        'meta_key' => 'post_views_count',
        'orderby' => 'meta_value_num',
        'order' => 'DESC',
        'date_query' => array(
	        array(
	            'after'     => date("Y-m-d", strtotime("-1 month")),
	            'inclusive' => true,
	        ),
	    )
    );
    if( $post_id && $post_id != '' ){
	   $posts_args['category__ID'] = wp_get_post_categories($post_id);
	   $posts_args['post__not_in'] = array($post_ID);
       if ($debug) echo 'has post ID'. $postID;
//       $post_categories=wp_get_post_categories($post_id);
    }
	$posts = get_posts( $post_args );
	if ($debug) print_r($posts);
    foreach( $posts as $id ) {
        if (count($output)>=$max) break;
        $id = intval( $id );
        if( !in_array( $id, $output) ) {
            $output[] = $id;
        }
    }
    if ($debug) print_r($output);
    if (count($output)==0)
    {
	    $post_args['date_query'][0]['after']=date("Y-m-d", strtotime("-1 year"));
	    if ($debug) print_r($posts);
	    $posts = get_posts( $post_args );
	    foreach( $posts as $id ) {
	        if (count($output)>=$max) break;
	        $id = intval( $id );
	        if( !in_array( $id, $output) ) {
	            $output[] = $id;
	        }
	    }
    }
    if ($debug) print_r($output);
    return $output;
}