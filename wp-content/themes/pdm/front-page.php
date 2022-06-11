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
        <button class="reset arrow-button" data-scrollTo=""><span class="circle"></span><?php echo getSVG('down-arrow'); ?></button>
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

<?php get_footer(); ?>