<?php get_header(); ?>

<section class="centered-hero">
   
    <div class="centered-hero__video">
        <div class="centered-hero__reveal"></div>
        <div id="grainy-vid"></div>
        <div class="spacer">
            <video class="lazy" autoplay="" muted="" playsinline="" loop="">
                <source type="video/mp4" data-src="/wp-content/uploads/2022/01/final_61d90728413189014339df60_141433.mp4">
            </video>
        </div>
    </div>
    
    <div class="centered-hero__content">
        <h1>Tailored digital <span>experiences</span> for your brand.</h1>
        <button class="reset arrow-button" data-scrollto=".projects"><span class="circle"></span><?php echo getSVG('down-arrow'); ?></button>
    </div>
    
</section>

<section class="projects">
    <ul>
        <li class="project" data-image="/wp-content/uploads/2022/01/image17.png">
            <a href="">
                Hello Noemie &#9679; E-Commerce &#9679; Jewelry &#9679;
            </a>
        </li>
        <li class="project" data-image="/wp-content/uploads/2022/01/image14.png">
            <a href="">
                PowerDigital &#9679; Lead - Gen &#9679; Digital Marketing &#9679;
            </a>
        </li>
        <li class="project" data-image="/wp-content/uploads/2022/01/image1.png">
            <a href="">
                Periscope &#9679; Portfolio &#9679; Private Equity &#9679;
            </a>
        </li>
        <li class="project" data-image="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-204041.png">
            <a href="">
                Victrola &#9679; E-Commerce &#9679; Audio &#9679;
            </a>
        </li>
        <li class="project" data-image="http://portfolio.dev.cc/wp-content/uploads/2022/01/Screenshot-2022-01-10-203244.png">
            <a href="">
                Greenwich St. Jewelers &#9679; E-Commerce &#9679; Jewelry &#9679;
            </a>
        </li>
    </ul>
    <div class="container projects__cta">
        <a href="" class="loop-btn">See All Projects &#9679;</a>
    </div>
</section>

<section class="callout">
    <div class="container container--large">
        
        <div class="callout__gradient">
            <div class="spacer parallax-item" value="15"></div>
        </div>
        
        <div class="callout__content">
            <span class="placeholder">Hi i'm </span> <h2><span class="highlight">Alex Kinejara</span>,<br/> a <span class="highlight-2">creative web developer</span> in San Diego, CA<span class="color">.</span></h2>
            <p>I help brands craft an <span class="highlight-2">effective online presence &amp; strategy</span> by developing websites tailored to their specific needs<span class="color">.</span></p>
        </div>
        
    </div>
</section>

<?php
    $args = array(
        'post_type' => 'post',
        'post_parent' => 0,
        'showposts' => 6,
    );
    $the_query = new WP_Query( $args );
?>

<section class="latest-posts">
    
    <div class="latest-posts__intro">
        <h2><span>More about</span> what I do.</h2>
        <a class="loop-btn" href="/blog/">View All Posts &#9679;</a>
    </div>

    <div class="latest-posts__loop simple-slider" draggable="false">
        <?php if( $the_query->have_posts() ){ ?>
            <?php while( $the_query->have_posts() ){  $the_query->the_post(); ?>
                <?php get_template_part('lib/parts/post-card'); ?>
            <?php } ?>
        <?php } ?>
    </div>
        
</section>

<?php get_footer(); ?>