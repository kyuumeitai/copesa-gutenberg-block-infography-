import './style.scss';
import './editor.scss';

const htmlBeautify = require( 'js-beautify' ).html;

import { UnControlled as CodeMirror } from 'react-codemirror2';

require( 'codemirror/mode/xml/xml' );
require( 'codemirror/mode/javascript/javascript' );
require( 'codemirror/mode/htmlmixed/htmlmixed' );
require( 'codemirror/mode/css/css' );

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { MediaUpload } = wp.editor;
const { Button } = wp.components;

registerBlockType( 'copesa-blocks/svg-infography', {
	title: 'Copesa SVG',
	icon: 'shield',
	category: 'common',
	attributes: {
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		id: {
			type: 'number',
		},
		src: {
			type: 'string',
		},
		width: {
			type: 'number',
		},
		height: {
			type: 'number',
		},
	},
	keywords: [
		__( 'copesa' ),
	],

	edit: function( props ) {
		const {
			className,
			attributes: {
				url,
				id,
				src,
			},
			setAttributes,
		} = props;

		let tempcode = '';

		const onSelectImage = ( media ) => {
			fetch( media.url )
				.then( r => r.text() )
				.then( mediasrc =>{
					tempcode = mediasrc;
					setAttributes( {
						url: media.url,
						id: media.id,
						src: mediasrc,
					} );
				}
				);
		};

		const onChangeCode = ( code ) => {
			tempcode = code;
			// setAttributes( {
			// 	src: code,
			// } );
		};

		const codeSave = ( ) => {
			setAttributes( {
				src: tempcode,
			} );
		};

		const CodemirrorMode = {
			name: 'htmlmixed',
			// scriptTypes: [ {
			// 	matches: /\/x-handlebars-template|\/x-mustache/i,
			// 	mode: null,
			// },
			// {
			// 	matches: /(text|application)\/(x-)?vb(a|script)/i,
			// 	mode: 'vbscript',
			// } ],
			// tags: {
			// 	style: [
			// 		[ null ], [ null, null, 'css' ],
			// 	],
			// },
		};

		return (
			<div className={ className }>
				<div className="svgimage">
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes={ [ 'image/svg+xml' ] }
						value={ id }
						render={ ( { open } ) => (
							<Button className={ id ? 'image-button' : 'button button-large' } onClick={ open } >
								{ ! id ? __( 'Subir SVG' ) : <span dangerouslySetInnerHTML={ { __html: src } }></span> }
							</Button>
						) }
					/>
					{
						id && (
							<div>
								<Button className="button button-large" onClick={ codeSave } >
									Guardar HTML
								</Button>
								<CodeMirror
									value={ htmlBeautify( src, { indent_size: 2 } ) }
									options={ {
										mode: CodemirrorMode,
										selectionPointer: true,
										theme: 'material',
										lineNumbers: true,
									} }
									onChange={ ( editor, data, value ) => {
										onChangeCode( value );
									} }
								/>
							</div>
						)
					}
				</div>

			</div>
		);
	},

	save: function( props ) {
		const {
			className,
			attributes: {
				src,
			},
		} = props;
		return (
			<div className={ className }>
				{
					src && (
						<span dangerouslySetInnerHTML={ { __html: src } }></span>
					)
				}
			</div>
		);
	},
} );
