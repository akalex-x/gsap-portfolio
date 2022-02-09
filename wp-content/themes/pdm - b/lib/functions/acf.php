<?php
    add_filter('acf/format_value/type=text', 'do_shortcode', 10, 3);
	add_filter('acf/format_value/type=textarea', 'do_shortcode', 10, 3);

	if (function_exists('acf_add_options_page')) {
		acf_add_options_page(array(
			'page_title'    => 'Theme Settings',
			'menu_title'    => 'Global Settings',
			'menu_slug'     => 'theme-general-settings',
			'capability'    => 'edit_posts',
			'redirect'      => false
		));

		acf_add_options_sub_page(array(
			'page_title'    => 'Theme Header Settings',
			'menu_title'    => 'Header Settings',
			'parent_slug'   => 'theme-general-settings',
		));

		acf_add_options_sub_page(array(
			'page_title'    => 'Theme Footer Settings',
			'menu_title'    => 'Footer Settings',
			'parent_slug'   => 'theme-general-settings',
		));

		acf_add_options_sub_page(array(
			'page_title'    => 'Additional Scripts',
			'menu_title'    => 'Additional Scripts',
			'parent_slug'   => 'theme-general-settings',
		));

		acf_add_options_sub_page(array(
			'page_title'    => 'Style Guide',
			'menu_title'    => 'Style Guide',
			'parent_slug'   => 'theme-general-settings',
		));

	}

	add_filter('acf/load_field/name=gform', 'load_gforms');
    function load_gforms( $field ) {
		if(!class_exists('GFAPI')) {return;}
        $forms = GFAPI::get_forms();

        $field['choices'] = array();
        $field['choices'][''] = 'Select a Form';
        foreach ($forms as $form) {
            $field['choices'][ $form['id'] ] = $form['title'];
        }

        return $field;
    }