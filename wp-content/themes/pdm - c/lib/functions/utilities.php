<?php

    function buildAttr($attr, $val = null){
        if(is_array($attr) && !empty(array_filter($attr))) {
            $attrs = $attr;
            $builtAttrs = array();

            foreach ($attrs as $key => $val) {
                if(is_array($val)) $val = join(' ', array_filter($val, 'strlen'));
                if(empty($val)) continue;

                $builtAttrs[] = $key.'="'.$val.'"';
            }

            return join(' ', array_filter($builtAttrs, 'strlen'));

        } else {
            if(is_array($val)) $val = join(' ', array_filter($val,'strlen'));
            if(empty($val)) return;

            return $attr. '="' . $val . '"';
        }
    }

	function handleize($string) {
		//Lower case everything
		$string = strtolower($string);
		//Make alphanumeric (removes all other characters)
		$string = preg_replace("/[^a-z0-9_\s-]/", "", $string);
		//Clean up multiple dashes or whitespaces
		$string = preg_replace("/[\s-]+/", " ", $string);
		//Convert whitespaces and underscore to dash
		$string = preg_replace("/[\s_]/", "-", $string);
		return $string;
	}

    function limit($content, $limit = 25) {
        if(empty($content)) return;

        $excerpt = explode(' ', $content, $limit);

        if (count($excerpt) >= $limit) {
            array_pop($excerpt);
            $excerpt = implode(" ", $excerpt) . '...';
        } else {
            $excerpt = implode(" ", $excerpt);
        }

        $excerpt = preg_replace('`\[[^\]]*\]`', '', $excerpt);

        return $excerpt;
    }

    function excerpt($id = 1, $limit=50) {
		$id = $id === 1 ? get_the_ID() : $id;

        return limit(get_the_excerpt($id), $limit);
	}

	function getFile($path) {
		if (is_file($path)) {
			ob_start();
			include $path;
			return ob_get_clean();
		}
		return false;
	}

	function getSVG($name, $title = false, $icon = true){
		$svgPath = get_template_directory() . '/dist/svgs/';
		$svg = getFile($svgPath.$name.'.svg');

		if($svg){
			// title arg exists and the svg has a title tag to replace
			if( !empty($title) && preg_match("/<title>(.+)<\/title>/i", $svg, $matches)) {
				$title = '<title>'.$title.'</title>';
				$svg = preg_replace("/<title>(.+)<\/title>/i", $title, $svg);
            }

            $svgType = $icon ? 'icon' : 'code';

            $html = '<div class="svg-'.$svgType.' svg-'.$svgType.'--'.$name.'">';
            $html .= !$icon ? $svg : '<div class="positioner">'.$svg.'</div>';
            $html .= '</div>';

            return $html;
		}

		return false;
	}

    function getSocialLinks($id = 'option'){
        $socials = get_field('socials', $id);

        if(!empty($socials)) {
            $html = '<nav class="social-links"><ul>';

            foreach($socials as $link){
                $label = $link['label']['label'];
                $icon = strtolower($label);
                $url = $link['url'];

                if($icon == 'other'){
                    $icon = 'world';
                }

                $html .= '<li><a href="'.$url.'" target="_blank">';
                $html .= getSVG($icon, $label.' - '.$url);
                $html .= '</a></li>';
            }

            $html .= '</ul></nav>';
            return $html;
        }
        return false;
    }

    function getShareLinks(){
        $page_url = get_the_permalink();
        $page_img = get_the_post_thumbnail_url( );
        $page_title = get_the_title();

        $shareLinks = array(
            'facebook' => 'https://www.facebook.com/sharer/sharer.php?u='.$page_url,
            'twitter' => 'https://twitter.com/intent/tweet?text='.$page_title.'%0A'.$page_url,
            'linkedin' => 'https://www.linkedin.com/shareArticle?mini=true&url='.$page_url.'&title='.$page_title.'&summary='.$page_title.'%0A'.$page_url,
            'pinterest' => 'https://pinterest.com/pin/create/button/?url='.$page_url.'&media='.$page_img.'&description='.$page_title.'%0A'.$page_url,
            'email' => 'mailto:?subject='.$page_title.'&body='.$page_title.'%0A'.$page_url
        );

        $html = '<div class="social-share">';
        $html .= '<ul class="social-share-list">';
        $html .= '<li>'.getSVG('share').' Share</li>';

        foreach($shareLinks as $social => $link):
            $html .= '<li>';
            $html .= '<a class="social-share-link social-share-link--'.$social.'" href="'.$link.'" target="_blank">'.getSVG($social).'</a>';
            $html .= '</li>';
        endforeach;

        $html .= '</ul">';
        $html .= '</div>';

        echo $html;
    }

    function readTime($content){
        $word_count = str_word_count( strip_tags( $content ) );
        $readingtime = ceil($word_count / 250);

		$timer = "min read";
		$totalreadingtime = $readingtime . $timer;

        if( $readingtime != 0 ){
            return $totalreadingtime;
        }
    }