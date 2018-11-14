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
const { MediaUpload, RichText } = wp.editor;
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
		title: {
			source: 'attribute',
			selector: 'h2',
		},
		undertitle: {
			source: 'attribute',
			selector: 'h3',
		},
		description: {
			source: 'attribute',
			selector: 'p',
		},
		source: {
			source: 'attribute',
			selector: 'h4',
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
				title,
				undertitle,
				description,
				source,
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
		};

		return (
			<div className={ className }>
				<RichText
					tagName="h2"
					className="svgtitle"
					placeholder="Título de la Infografía"
					value={ title }
					onChange={ ( title ) => setAttributes( { title } ) }
				/>
				<RichText
					tagName="h3"
					className="svgundertitle"
					placeholder="Bajada"
					value={ undertitle }
					onChange={ ( undertitle ) => setAttributes( { undertitle } ) }
				/>
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
									Guardar SVG
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
				<RichText
					tagName="p"
					className="svgdescription"
					placeholder="Descripción"
					value={ description }
					onChange={ ( description ) => setAttributes( { description } ) }
				/>
				<RichText
					tagName="h4"
					className="svgsource"
					placeholder="Fuente"
					value={ source }
					onChange={ ( source ) => setAttributes( { source } ) }
				/>

			</div>
		);
	},

	save: function( props ) {
		const {
			className,
			attributes: {
				src,
				title,
				undertitle,
				description,
				source,
			},
		} = props;
		return (
			<div className={ className }>
				{
					title && (
						<RichText.Content tagName="h2" className="svgtitle" value={ title } />
					)
				}
				{
					undertitle && (
						<RichText.Content tagName="h3" className="svgundertitle" value={ undertitle } />
					)
				}
				{
					src && (
						<span className="svgcode" dangerouslySetInnerHTML={ { __html: src } }></span>
					)
				}
				{
					description && (
						<RichText.Content tagName="p" className="svgdescription" value={ description } />
					)
				}
				{
					source && (
						<RichText.Content tagName="h4" className="svgsource" value={ source } />
					)
				}
			</div>
		);
	},
} );
