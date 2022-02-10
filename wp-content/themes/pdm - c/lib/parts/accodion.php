<?php
	$icon = getIMG($args['icon']['ID'], 'thumb');
	$label = $args['label'];
	$content = $args['content'];
	$active = (bool) $args['active'];
?>

<div class="accordion<?php echo $active ? " active" : null; ?>">
    <button class="accordion__trigger" type="button">
        <?php if($icon): ?><div class="accordion__icon"><?php echo $icon; ?></div><?php endif; ?>
        <span class="accordion__label"><?php echo $label; ?></span>
        <?php echo getSVG('chevron'); ?>
    </button>
    <div class="accordion__content"><?php echo $content; ?></div>
</div>