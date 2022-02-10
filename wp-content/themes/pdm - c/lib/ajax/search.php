<?php
add_action( 'wp_ajax_nopriv_search', 'search' );
add_action( 'wp_ajax_search', 'search' );
function search(){

    $sTerm = $_POST["query"];
    if(empty($sTerm)) {
        print json_encode(array(
            'status' => 'error',
            'message' => 'empty term'
        ));
        die();
    };

    $pageResults = new WP_Query(array(
        'post_type' => 'page',
        'orderby' => 'relevance',
        's' => $sTerm
    ));

    $postResults = new WP_Query(array(
        'post_type' => 'post',
        'orderby' => 'relevance',
        's' => $sTerm
    ));

    $results = array(
        'term' => $sTerm,
    );

    if($pageResults->have_posts()) {
        $html = '';
        while($pageResults->have_posts()) { $pageResults->the_post();
            $permalink = get_the_permalink();
            $headline = get_the_title();
			$excerpt = excerpt(25);

            ob_start();
            include locate_template('lib/parts/search-card.php');
            $html .=  ob_get_clean();
        }
        $results['pages'] = $html;
    }

    if($postResults->have_posts()) {
        $html = '';
        while($postResults->have_posts()) { $postResults->the_post();
            $permalink = get_the_permalink();
            $headline = get_the_title();
            $excerpt = excerpt(25);

            ob_start();
            include locate_template('lib/parts/search-card.php');
            $html .=  ob_get_clean();
        }
        $results['posts'] = $html;
    }


    print json_encode($results);

    exit();
};