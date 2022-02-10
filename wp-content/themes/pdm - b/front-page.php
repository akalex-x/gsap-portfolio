<?php get_header(); ?>

<section class="home-hero full-height">
	
	<div class="home-hero__bg__left"></div>
	<div class="home-hero__bg__right"></div>
	
	<div class="home-hero__video">
		<div class="spacer">
			<video autoplay muted playsinline loop>
				<source type="video/mp4" src="http://portfolio.dev.cc/wp-content/uploads/2022/01/final_61d90728413189014339df60_141433.mp4">
			</video>
		</div>
	</div>
	
	<div class="home-hero__content">
		<div class="content-wrap">
			<span class="h1">Alex <br/> Kinejara</span>
			<h1>Web Development in San Diego, CA</h1>
			<button class="reset arrow-btn arrow-btn--down next-section-trigger">View More <?php echo getSVG('chevron'); ?></button>
		</div>
		<div class="other-content">
			<span class="h1">Alex <br/> Kinejara</span>
		</div>
	</div>

</section>

<section class="portfolio">
	<div class="portfolio__wrap">
		
		<div class="portfolio__content">
			<h2>Tailored digital experiences for your brand.</h2>
		</div>
		
		<div class="portfolio__images">
			<ul>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-203717.png" class="" alt=""></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-204041.png" class="victrola" alt="Victrola"></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-203548.png" class="" alt=""></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-203139.png" class="" alt=""></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-203244.png" class="gst" alt="Greenwich St Jewelers"></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-204310.png" class="" alt=""></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-204548.png" class="" alt=""></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-204242.png" class="now" alt="Now Insurance"></li>
				<li><img src="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-204518.png" class="" alt=""></li>
			</ul>
		</div>

		<div class="portfolio__items">

			<ul>
				<li class="h3 marquee" data-screen="victrola" data-image="/wp-content/uploads/2022/01/image14.png"><a class="marquee__wrapper" href=""><span>Victrola &bull; E-Commerce &bull; Audio &bull;</span></a></li>
				<li class="h3 marquee" data-screen="gst" data-image="/wp-content/uploads/2022/01/image17.png"><a class="marquee__wrapper" href=""><span>Greenwich St. Jewlers &bull; E-Commerce &bull; Jewlery &bull;</span></a></li>
				<li class="h3 marquee" data-screen="now" data-image="/wp-content/uploads/2022/01/image1.png"><a class="marquee__wrapper" href=""><span>NowInsurance &bull; Lead Gen &bull; Insurance &bull;</span></a></li>
			</ul>

		</div>
		
	</div>
</section>

<section class="video-zoom">
        
    <div class="video-zoom__wrap">
        <div class="video-zoom__wrap__positioner">
            <video autoplay muted playsinline loop>
                <source type="video/mp4" src="http://portfolio.dev.cc/wp-content/uploads/2022/01/final_61d90728413189014339df60_141433.mp4">
            </video>
        </div>
        <img src="<?php echo get_template_directory_uri(); ?>/dist/img/iphone.png" alt="iPhone frame">
    </div>
       
    <div class="video-zoom__content">
        <h2>Lorem ipsum dolor sit amet consectetur.</h2>
    </div>
        
</section>

<?php get_footer(); ?>