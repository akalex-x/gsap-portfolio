<?php
	$content = get_sub_field('content');

	$classList[] = '';
	$attr = buildAttr(array('id'=>$id,'class'=>$classes));
?>

<section <?php echo $attr; ?>>
    <div class="container container--medium">
        <div class="content-block__content">
            <?php echo $content; ?>
        </div>
    </div>
</section>