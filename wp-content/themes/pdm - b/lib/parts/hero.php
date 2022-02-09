<?php

$classList = array('hero');
$feat_img_id = $isPTArchive ? get_field('feat_img', $post_type)['ID'] : get_post_thumbnail_id($post_id);
$hero = $isPTArchive ? get_field('hero', $post_type) : get_field('hero', $post_id);
$feat_img = getIMG($feat_img_id, 'hero', true);

if(!empty($feat_img)) $classList[] = 'lazy';

if($isHome){
    $classList[] = 'hero--home';
} elseif ($isBlog){
    $classList[] = 'hero--blog hero--archive';
} elseif ($isCategory){
    $classList[] = 'hero--category';
} elseif ($isArchive || $isPTArchive){
    $classList[] = 'hero--archive';
} else {
    $classList[] = 'hero--single';
    if($post_type)  $classList[] = 'hero--'.$post_type;
}

if (is_404()) {
    $title = 'Page Not Found';
} elseif($hero['headline']) {
    $title = $hero['headline'];
} elseif ($isPTArchive) {
	$title = post_type_archive_title('', false);
} elseif ($isCategory || $isArchive) {
    $query = get_queried_object(  );
    $title = $query->name;
} else {
    $title = get_the_title($post_id);
}

$classes = buildAttr('class', $classList);

if($hero || $title):
?>
<section <?php echo $classes; echo $feat_img;?>>
    <div class="container">
        <h1 class="hero__title"><?php echo $title; ?></h1>
        <?php if (empty($hero['content'])):?>
        <div class="hero__content"><?php echo $hero['content'];  ?></div>
        <?php endif; ?>
    </div>
</section>
<?php endif; ?>