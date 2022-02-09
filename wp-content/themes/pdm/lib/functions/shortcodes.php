<?php

/* Example Shortcode

add_shortcode('greet', 'greet_shortcode');
function greet_shortcode($user_attr){
	// shortcode defaults
	$attr = shortcode_atts( array(
		'text' => 'Hello, World!'
	), $user_attr);

	return $attr['text'];
}

// Example 1:	[greet] // Hello, World!
// Example 2: [greet text="What does it say, I can't read spaghetti"] // What does it say, I can't read spaghetti"
*/

// -----------------------------
// BUTTON
// -----------------------------
add_shortcode('button', 'button_shortcode');
function button_shortcode($user_attr) {
	$classList = array('btn');

	$attr = shortcode_atts( array(
		'class' => '',
		'color' => '',
		'id' => '',
		'style' => '',
		'text' => '',
		'url' => '',
	), $user_attr);

	$styles = array_filter(explode(' ', $attr['style']));
	if($styles){
		foreach($styles as $style){
			$classList[] = 'btn--'.$style;
		}
	}

	$classList[] = $attr['class'];
	if(!empty($attr['color'])) {
		$classList[] = 'btn--'.$attr['color'];
	}

	$elTag = !empty($attr['url']) ? 'a' : 'button type="button"';

	$btn_attr = buildAttr(array(
		'id' => $attr['id'],
		'href' => $attr['url'],
		'class' => $classList
	));

	$html = '<'.$elTag.' '.$btn_attr.'>';
	$html .= $attr['text'];
	$html .= '</'.$elTag.'>';

	return $html;
}

// -----------------------------
// SUBHEADING
// -----------------------------
add_shortcode('subheading', 'subheading');
function subheading($user_attr, $content){
	$attr = shortcode_atts( array(
		'text' => '',
	), $user_attr);

	$content = !empty($attr['text']) ? $attr['text'] : $content;

	return '<span class="subheading">'.$content.'</span>';
}

add_shortcode('heading', 'heading');
function heading($user_attr, $content){
	$attr = shortcode_atts( array(
		'text' => '',
	), $user_attr);

	$content = !empty($attr['text']) ? $attr['text'] : $content;

	return '<span class="heading">'.$content.'</span>';
}

// -----------------------------
// SVG
// -----------------------------
add_shortcode('svg', 'svg_shortcode');
function svg_shortcode($user_attr){
	// shortcode defaults
	$attr = shortcode_atts( array(
		'name' => '',
		'title' => 'false',
		'wrap' => 'true'
	), $user_attr);

	return getSVG($attr['name'], $attr['title'] === 'true', $attr['wrap'] === 'true');
}

// -----------------------------
// accent TEXT
// -----------------------------
add_shortcode('accent', 'accent_shortcode');
function accent_shortcode($user_attr, $content){
	// shortcode defaults
	$attr = shortcode_atts( array(
		'color' => ''
	), $user_attr);

	$classList = array('accent');
	if(!empty($attr['color'])) $classList[] = 'accent--%1s';

	$classes = buildAttr('class', $classList);

	return '<span '.$classes.'>'.$content .'</span>';
}


// -----------------------------
// CHECKLIST
// -----------------------------
add_shortcode('checklist', 'checklist_shortcode');
function checklist_shortcode($attr, $content){
	if(empty($content)) return;

	$ul = '<ul class="checklist">';
	$items = preg_split('/<br[^>]*>/i', trim($content));
	$check = getSVG('check');

	foreach($items as $li){
		$li = trim($li);
		if(strlen($li) > 0){ $ul .= '<li>'.$check.$li.'</li>'; }
	}

	$ul .= '</ul>';

	return $ul;
}

// -----------------------------
// H1
// -----------------------------
add_shortcode('h1', 'h1_shortcode');
function h1_shortcode($attr, $content){
	return '<span class="h1">'.$content.'</span>';
}

// -----------------------------
// H2
// -----------------------------
add_shortcode('h2', 'h2_shortcode');
function h2_shortcode($attr, $content){
	return '<span class="h2">'.$content.'</span>';
}

// -----------------------------
// H3
// -----------------------------
add_shortcode('h3', 'h3_shortcode');
function h3_shortcode($attr, $content){
	return '<span class="h3">'.$content.'</span>';
}

// -----------------------------
// H4
// -----------------------------
add_shortcode('h4', 'h4_shortcode');
function h4_shortcode($attr, $content){
	return '<span class="h4">'.$content.'</span>';
}

// -----------------------------
// H5
// -----------------------------
add_shortcode('h5', 'h5_shortcode');
function h5_shortcode($attr, $content){
	return '<span class="h5">'.$content.'</span>';
}

add_shortcode('b', 'bold_shortcode');
function bold_shortcode($attr, $content){
	return '<strong>'.$content.'</strong>';
}

add_shortcode('i', 'italic_shortcode');
function italic_shortcode($attr, $content){
	return '<em>'.$content.'</em>';
}