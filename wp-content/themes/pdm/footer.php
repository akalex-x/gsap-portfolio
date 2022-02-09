<?php global $site_logo;

    $footer = get_field('footer', 'option');

    if(!empty($footer['site_logo'])) $site_logo = getIMG( $footer['site_logo']['ID'], 'card', false, array('alt' => get_bloginfo( 'name' ), 'lazy' => false));
?>

</main>
</div>

<footer class="gfooter">
    <div class="container">
        <div class="row">
            <div class="col col--left">
                <div class="gfooter-content">
                    <div class="gfooter__logo">
                        <a class="site-logo" href="<?php echo home_url(); ?>"><?php echo $site_logo; ?></a>
                    </div>

                    <?php echo getSocialLinks(); ?>
                </div>
            </div>
            <div class="col col--right">
                <div class="gfooter-menus">

                    <nav class="menu menu--foot">
                        <?php
                            wp_nav_menu(array(
                                'container' => false,
                                'items_wrap' => '<ul id="%1$s">%3$s</ul>',
                                'walker' => new PDM_Navwalker(),
                                'theme_location' => 'foot'
                            ));
                        ?>
                    </nav>
                </div>
            </div>
        </div>
        <div class="gfooter-bottom">
            <div class="gfooter__copy">
                <p class="copy">&copy; <?php echo date("Y"); ?> <?php bloginfo( 'name' ); ?>. All rights reserved.</p>
            </div>
        </div>
    </div>
</footer>

<div class="pdm-lightbox pdm-lightbox--reset">
    <div class="pdm-lightbox__container">
        <button class="pdm-lightbox__close" type="button">Close Popup</button>
        <div class="pdm-lightbox__content"></div>
    </div>
</div>

<div class="alt-cursor">
	<div class="basic">
		<div class="svg-icon">
			<div class="spacer">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297 297">
					<clipPath id="circle-border" clipPathUnits="objectBoundingBox">
						<path d="M0.5,1 a0.504,0.504,0,0,1,-0.101,-0.01 a0.497,0.497,0,0,1,-0.179,-0.075 a0.501,0.501,0,0,1,-0.181,-0.22 a0.497,0.497,0,0,1,-0.029,-0.094 a0.505,0.505,0,0,1,0,-0.202 a0.497,0.497,0,0,1,0.075,-0.179 a0.501,0.501,0,0,1,0.22,-0.181 a0.497,0.497,0,0,1,0.094,-0.029 a0.505,0.505,0,0,1,0.202,0 a0.497,0.497,0,0,1,0.179,0.075 a0.501,0.501,0,0,1,0.181,0.22 a0.497,0.497,0,0,1,0.029,0.094 a0.505,0.505,0,0,1,0,0.202 a0.497,0.497,0,0,1,-0.075,0.179 a0.501,0.501,0,0,1,-0.22,0.181 a0.497,0.497,0,0,1,-0.094,0.029 A0.504,0.504,0,0,1,0.5,1 m0,-0.936 A0.436,0.436,0,1,0,0.936,0.5 A0.437,0.437,0,0,0,0.5,0.064"></path>
					</clipPath>
				</svg>
			</div>
		</div>
	</div>
	<div class="portfolio-cursor">
		<div class="spacer">
			<div class="positioner">
			</div>
		</div>
	</div>
</div>

<?php wp_footer(); ?>

<?php echo get_field('body_scripts_bottom', 'option'); ?>
</body>

</html>