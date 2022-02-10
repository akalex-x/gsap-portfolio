<?php
	$classList = array('gheader');

	if($isHome) $classList[] = 'gheader--home';
	elseif ($isBlog) $classList[] ='gheader--blog';
	elseif ($isArchive || $isPTArchive) $classList[] ='gheader--archive';
	elseif (!empty($post_type)) $classList[] = 'gheader--'.$post_type;

    $classList[] = 'sticky';

	$class = buildAttr('class', $classList);
?>

<header <?php echo $class; ?>>
    <div class="gheader-content">
        <div class="container">

            <div class="gheader__logo">
                <a class="site-logo" href="<?php echo home_url(); ?>"><?php echo $site_logo; ?></a>
            </div>

            <nav class="global menu menu--main" aria-label="main navigation">
                <?php
				wp_nav_menu(array(
					'container' => false,
					'items_wrap' => '<ul id="%1$s">%3$s</ul>',
					'walker' => new PDM_Navwalker(),
					'theme_location' => 'main'
				));
			?>
            </nav>

            <button type="button" class="menu-burger" title="Menu">
                <span class="menu-burger__text">Menu</span>
                <span class="menu-burger__icon"><span></span></span>
            </button>

        </div>
    </div>

</header>