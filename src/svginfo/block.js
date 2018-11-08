import './style.scss';
import './editor.scss';

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
				// width,
				// height,
			},
			setAttributes,
		} = props;

		const onSelectImage = ( media ) => {
			console.log( 'derp' );
			setAttributes( {
				url: media.url,
				id: media.id,
			} );
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
								{ ! id ? __( 'Subir SVG' ) : <img className="svg" src={ url } alt="" /> }
							</Button>
						) }
					/>
				</div>
			</div>
		);
	},

	save: function( props ) {
		const {
			className,
			attributes: {
				url,
			},
		} = props;
		return (
			<div className={ className }>
				{
					url && (
						<img className="svg-image" src={ url } alt="" />
					)
				}
			</div>
		);
	},
} );
