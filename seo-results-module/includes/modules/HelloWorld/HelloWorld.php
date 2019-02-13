<?php

class SERM_HelloWorld extends ET_Builder_Module {

	public $slug       = 'serm_hello_world';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://github.com/Shields-Art-Studios/seo-results-script',
		'author'     => 'Jack Woods',
		'author_uri' => 'http://github.com/jackrwoods',
	);

	public function init() {
		$this->name = esc_html__( 'Hello World', 'serm-seo-results-module' );
	}

	public function get_fields() {
		return array(
			'content' => array(
				'label'           => esc_html__( 'Content', 'serm-seo-results-module' ),
				'type'            => 'tiny_mce',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Content entered here will appear inside the module.', 'serm-seo-results-module' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		return sprintf( '<h1>%1$s</h1>', $this->props['content'] );
	}
}

new SERM_HelloWorld;
