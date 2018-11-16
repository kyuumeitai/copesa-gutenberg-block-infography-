import { RichText } from '@wordpress/editor';
// const { RichText } = wp.editor;
import edit from './edit';
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { createBlobURL } = wp.blob;
// import { createBlock, registerBlockType } from '@wordpress/blocks';
// import { createBlobURL } from '@wordpress/blob';

const name = 'copesa-blocks/podcast';
const settings = {
	title: 'Copesa Podcast',
	icon: 'shield',
	category: 'common',
	attributes: {
		src: {
			type: 'string',
			// source: 'attribute',
			selector: 'audio',
			attribute: 'src',
		},
		caption: {
			type: 'string',
			// source: 'html',
			selector: 'figcaption',
		},
		id: {
			type: 'number',
		},
		autoplay: {
			type: 'boolean',
			// source: 'attribute',
			selector: 'audio',
			attribute: 'autoplay',
		},
		loop: {
			type: 'boolean',
			// source: 'attribute',
			selector: 'audio',
			attribute: 'loop',
		},
		preload: {
			type: 'string',
			// source: 'attribute',
			selector: 'audio',
			attribute: 'preload',
		},
	},

	transforms: {
		from: [
			{
				type: 'files',
				isMatch( files ) {
					return files.length === 1 && files[ 0 ].type.indexOf( 'audio/' ) === 0;
				},
				transform( files ) {
					const file = files[ 0 ];
					// We don't need to upload the media directly here
					// It's already done as part of the `componentDidMount`
					// in the audio block
					const block = createBlock( 'copesa-blocks/podcast', {
						src: createBlobURL( file ),
					} );

					return block;
				},
			},
		],
	},
	keywords: [
		__( 'copesa' ),
	],
	edit,
	// edit() {
	// 	return (
	// 		<div className="asdfasdf">hola</div>
	// 	);
	// },

	save( { attributes } ) {
		const { autoplay, caption, loop, preload, src } = attributes;
		return (
			<figure>
				<audio controls="controls" src={ src } autoPlay={ autoplay } loop={ loop } preload={ preload } />
				{ ! RichText.isEmpty( caption ) && <RichText.Content tagName="figcaption" value={ caption } /> }
			</figure>
		);
	},
};
const bla = registerBlockType( name, settings );
console.log( bla );

