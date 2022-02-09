<?php get_header();

$term = $_REQUEST['s'];

$author_args = array(
    'order' => 'ASC',
    'orderby' => 'display_name',
    'search' => '*' . esc_attr($term) . '*',
    'search_columns' => array('display_name', 'first_name', 'last_name', 'user_nicename'),
    'has_published_posts' => true
);

$author_search = new WP_User_Query($author_args);

$args = array(
    'post_type' => array('post', 'page'),
    'orderby' => 'relevance'
);

if (!empty($author_search->get_results())) {
    $author_ids = join(',', wp_list_pluck($author_search->get_results(), 'ID'));
    $args['author'] = $author_ids;
} else {
    $args['s'] = $term;
}

$posts = new WP_Query($args);

$posts_page = $posts->get_query_var('paged') ? $posts->get_query_var('paged') : 1;
$posts_per_page = $posts->query['posts_per_page'];
$max_num_pages = $posts->max_num_pages;

$loadmore = array(
    'query' => json_encode($posts->query_vars),
    'page_count' => $max_num_pages,
    'current_page' => $posts_page
);
?>

<section class="search-content">
    <div class="container">
        <h1><?php _e("Search Results for", "powertheme"); ?> <span class="search-term">'<?php echo get_search_query(); ?>'</span></h1>

        <?php if ($posts->have_posts()) : ?>
        <div class="search-results__list post-list">
            <?php while ($posts->have_posts()) : $posts->the_post();
                    get_template_part('lib/parts/post-card');
                endwhile; ?>
        </div>
        <?php if ($max_num_pages > 1) get_template_part('lib/parts/loadmore', null, $loadmore); ?>
        <?php else : ?>
        <h2 class="h1"><?php _e("No Posts Found", "powertheme"); ?></h2>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>