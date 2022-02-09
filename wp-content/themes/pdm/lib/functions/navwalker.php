<?php
/**
 * WP Bootstrap Navwalker
 *
 * @package WP-Bootstrap-Navwalker
 */

/**
 * PDM_Navwalker class.
 *
 * @extends Walker_Nav_Menu
 */
class PDM_Navwalker extends Walker_Nav_Menu {

	/**
	 * Start Level.
	 *
	 * @see Walker::start_lvl()
	 * @since 3.0.0
	 *
	 * @access public
	 * @param mixed $output Passed by reference. Used to append additional content.
	 * @param int   $depth (default: 0) Depth of page. Used for padding.
	 * @param array $args (default: array()) Arguments.
	 * @return void
	 */
	public function start_lvl( &$output, $depth = 0, $args = array() ) {
		$indent = str_repeat( "\t", $depth );
		$classes = array('dropdown','sub-menu','depth-'.$depth);

		$ul_classes = apply_filters('nav_menu_submenu_css_class', $classes, $args, $depth);

		$ul_attrs = buildAttr(array(
			'class' => $ul_classes,
			'role' => 'menu'
		));

		$output .= "\n".$indent.'<ul '.$ul_attrs.'>'."\n";
	}

	/**
	 * Start El.
	 *
	 * @see Walker::start_el()
	 * @since 3.0.0
	 *
	 * @access public
	 * @param mixed $output Passed by reference. Used to append additional content.
	 * @param mixed $item Menu item data object.
	 * @param int   $depth (default: 0) Depth of menu item. Used for padding.
	 * @param array|object $args (default: array()) Arguments.
	 * @param int   $id (default: 0) Menu item ID.
	 * @return void
	 */
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		$attr_title = $item->attr_title;
		$item_id = $item->ID;
		$object = $item->object;
		$type = $item->type;
		$title = $item->title;
		$permalink = $item->url;
		$menu_name = $args->theme_location;
		$exclude_item_classes = array(
			'menu-item-object',
			'menu-item-object-'.$item_id,
			'menu-item-object-'.$type,
			'menu-item-object-'.$object,
			'menu-item-type-'.$type,
			'menu-item-has-children'
		);

		$item_classes = !empty($item->classes) ? array_filter(array_diff( $item->classes, $exclude_item_classes )) : array();

		/**
		* Dividers, Headers or Disabled
		* =============================
		* Determine whether the item is a Divider, Header, Disabled or regular
		* menu item. To prevent errors we use the strcasecmp() function to so a
		* comparison that is not case sensitive. The strcasecmp() function returns
		* a 0 if the strings are equal.
		*/

		/* .menu-item element */
		$menuitem_attrs = array();
		$menuitem_classes = $item_classes;

		$isDivider = strtolower($title) == 'divider' && $depth === 1;
		$isHeader = in_array('dropdown-header', $menuitem_classes, true) && $depth === 1;
		$isDisabled = in_array('disabled', $menuitem_classes, true);

		/* .menu-item */
		if($isHeader) $menuitem_classes = array('dropdown-header');
		elseif($isDivider) $menuitem_classes = array('divider');
		elseif($isDisabled) $menuitem_classes = array('disabled');
		else {
			$menuitem_classes[] = 'menu-item-' . $item_id;
			$menuitem_classes[] = 'nav-item';
			$menuitem_classes[] = 'item-lvl-'. $depth;

			if ( $args->has_children ) $menuitem_classes[] = 'dropdown depth-'. $depth;
			if ( in_array( 'current-menu-item', $menuitem_classes, true ) ) $menuitem_classes[] = 'current-page';
		}

		if($isHeader || $isDivider || $isDisabled) {
			$menuitem_attrs['role'] = 'presentation';
		} elseif( apply_filters( 'the_title', $title, $item_id ) != 'empty' ) {
				$menuitem_attrs['id'] = 'menu-item-'.$item_id;
				$menuitem_attrs['itemscope'] ='itemscope';
				$menuitem_attrs['itemtype'] = 'https://www.schema.org/SiteNavigationElement';
		}

		$menuitem_attrs['class'] = $menuitem_classes;
		$menuitem_attrs = buildAttr($menuitem_attrs);

		/* .nav-link element */
		$navlink_attrs = array();
		$navlink_classes = array('nav-link');

		if(!empty( $item->target )) $navlink_attrs['target'] = $item->target;
		if(!empty( $item->xfn )) $navlink_attrs['rel'] = $item->xfn;

		// If item has_children add atts to a.
		if ( $args->has_children && 0 === $depth ) {
			$navlink_attrs['href'] =  $permalink;
			$navlink_attrs['aria-haspopup'] = 'true';
			$navlink_classes[] = 'dropdown-toggle';
		} else {
			$navlink_attrs['href'] = $permalink;
		}

		if(empty($attr_title)) {
			if( apply_filters( 'the_title', $title, $item_id ) != 'empty' ){
				$navlink_attrs['itemprop'] = 'url';
			}
		}

		$navlink_attrs['class'] = $navlink_classes;
		$navlink_attrs = buildAttr($navlink_attrs);

		/* .inner element */
		$inner_attrs = array();
		$inner_classes = array('inner');

		if(empty($attr_title)) {
			if( apply_filters( 'the_title', $title, $item_id ) != 'empty' ){
				$inner_attrs['itemprop'] = 'name';
			}
		}

		$inner_attrs['class'] = $inner_classes;
		$inner_attrs = buildAttr($inner_attrs);

		/* item output */
		$item_output = '<li '.$menuitem_attrs.'>';
		$item_output .= $args->before;

		if($isHeader || $isDisabled) {
			$item_output .= '<span '.$inner_attrs.'>';
			$item_output .= apply_filters( 'the_title', $title, $item_id );
			$item_output .= '</span>';
		} elseif(!$isDivider) {
			$item_output .= '<a '.$navlink_attrs.'>';
			$item_output .= '<span '.$inner_attrs.'>';
			$item_output .= $args->link_before;
			$item_output .= apply_filters( 'the_title', $title, $item_id );
			$item_output .= $args->link_after;
			$item_output .= '</span>';
			$item_output .= '</a>';
		}

		if(!$isDisabled && !$isDivider && $args->has_children) {
			$item_output .= '<button type="button" class="mobile-arrow">';
			if($menu_name != 'foot') $item_output .= getSVG('chevron');
			$item_output .= '</button>';
		}

		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

	/**
	 * Traverse elements to create list from elements.
	 *
	 * Display one element if the element doesn't have any children otherwise,
	 * display the element and its children. Will only traverse up to the max
	 * depth and no ignore elements under that depth.
	 *
	 * This method shouldn't be called directly, use the walk() method instead.
	 *
	 * @see Walker::start_el()
	 * @since 2.5.0
	 *
	 * @access public
	 * @param mixed $element Data object.
	 * @param mixed $children_elements List of elements to continue traversing.
	 * @param mixed $max_depth Max depth to traverse.
	 * @param mixed $depth Depth of current element.
	 * @param mixed $args Arguments.
	 * @param mixed $output Passed by reference. Used to append additional content.
	 * @return null Null on failure with no changes to parameters.
	 */
	public function display_element( $element, &$children_elements, $max_depth, $depth, $args, &$output ) {
		if( !$element ) return;

		$id_field = $this->db_fields['id'];
		// Display this element.
		if ( is_object($args[0]) ) {
			$args[0]->has_children = !empty( $children_elements[ $element->$id_field ] );
		}

		parent::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );
	}
}