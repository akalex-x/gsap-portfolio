<?php
add_action( 'wp_ajax_nopriv_searchPosts', 'searchPosts' );

add_action( 'wp_ajax_searchPosts', 'searchPosts' );

function searchPosts(){
    
    $sTerm = $_POST["sTerm"];
    $results = array();
    
    query_posts(array( 
        'post_type' => array('post'),
        'post_parent' => 0,
        'showposts' => -20,
        's' => $sTerm
    ) );  
    
    if(have_posts()){ 
        while(have_posts()){ the_post(); 
            array_push($results, '<a href="'. get_the_permalink() .'"><article><h3>'.get_the_title().'</h3><div class="bottom"><span class="read">Read More</span><span class="date">'.get_the_date().'</span></div></article></a>');
        } 
    } 
    
    wp_reset_postdata();
    
    $results = array_unique($results);
    
    echo implode(" ",$results);
            
    exit();    
};