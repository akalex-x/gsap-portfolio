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
   
	<div class="container">

		<svg class="nav-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
		
			<linearGradient id="logo-gradient" x1="50%" y1="0%" x2="50%" y2="100%" > 

				<stop offset="100%" stop-color="#AD2831;">
					<animate attributeName="stop-color" values="#AD2831; #2F97C1; #FC60A8; #7A28CB; #AD2831;" dur="20s" repeatCount="indefinite"></animate>
				</stop>

<!--
				<stop offset="100%" stop-color="#FC60A8">
					<animate attributeName="stop-color" values="#FC60A8; #7A28CB; #FC60A8;" dur="12s" repeatCount="indefinite"></animate>
				</stop>

				<stop offset="100%" stop-color="#7A28CB">
					<animate attributeName="stop-color" values="#7A28CB; #2F97C1 #7A28CB;" dur="12s" repeatCount="indefinite"></animate>
				</stop>
-->

			</linearGradient> 
			
			<path class="nav-overlay-path" stroke-width="0" vector-effect="non-scaling-stroke" fill="url('#logo-gradient')" d="M 0 0 V 0 H 100 V 0 C 100 0 50 0 0 0 z"></path>
			
		</svg>
		
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
		
		<div class="gheader__logo">
			<a class="site-logo" href="<?php echo home_url(); ?>"><?php echo getSVG('logo'); ?></a>
		</div>

		<button type="button" class="menu-burger" title="Menu">
			<span class="menu-burger__text">Menu</span>
			<span class="menu-burger__icon"><span></span></span>
		</button>

	</div>

</header>