<?php
/**
 * Plugin Name: Copesa Gutenberg Block de Infografía
 * Plugin URI: http://alex.acunaviera.com
 * Description: Custom plugin para Copesa
 * Author: Álex Acuña Viera
 * Author URI: http://alex.acunaviera.com/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
