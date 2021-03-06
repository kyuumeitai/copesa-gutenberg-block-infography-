/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const {
	Disabled,
	IconButton,
	PanelBody,
	SelectControl,
	Toolbar,
	ToggleControl,
	withNotices,
} = wp.components;

const {
	Component,
	Fragment,
} = wp.element;

const {
	BlockControls,
	InspectorControls,
	MediaPlaceholder,
	RichText,
	mediaUpload,
} = wp.editor;

const { getBlobByURL, isBlobURL } = wp.blob;

const ALLOWED_MEDIA_TYPES = [ 'audio' ];

class AudioEdit extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			editing: ! this.props.attributes.src,
		};

		this.toggleAttribute = this.toggleAttribute.bind( this );
		this.onSelectURL = this.onSelectURL.bind( this );
	}

	componentDidMount() {
		const { attributes, noticeOperations, setAttributes } = this.props;
		const { id, src = '' } = attributes;

		if ( ! id && isBlobURL( src ) ) {
			const file = getBlobByURL( src );

			if ( file ) {
				mediaUpload( {
					filesList: [ file ],
					onFileChange: ( [ { id: mediaId, url } ] ) => {
						setAttributes( { id: mediaId, src: url } );
					},
					onError: ( e ) => {
						setAttributes( { src: undefined, id: undefined } );
						this.setState( { editing: true } );
						noticeOperations.createErrorNotice( e );
					},
					allowedTypes: ALLOWED_MEDIA_TYPES,
				} );
			}
		}
	}

	toggleAttribute( attribute ) {
		return ( newValue ) => {
			this.props.setAttributes( { [ attribute ]: newValue } );
		};
	}

	onSelectURL( newSrc ) {
		const { attributes, setAttributes } = this.props;
		const { src } = attributes;

		// Set the block's src from the edit component's state, and switch off
		// the editing UI.
		if ( newSrc !== src ) {
			setAttributes( { src: newSrc, id: undefined } );
		}

		this.setState( { editing: false } );
	}

	render() {
		const { autoplay, caption, loop, preload, src, title, undertitle, description, author } = this.props.attributes;
		const { setAttributes, isSelected, className, noticeOperations, noticeUI } = this.props;
		const { editing } = this.state;

		const switchToEditing = () => {
			this.setState( { editing: true } );
		};
		const onSelectAudio = ( media ) => {
			if ( ! media || ! media.url ) {
				// in this case there was an error and we should continue in the editing state
				// previous attributes should be removed because they may be temporary blob urls
				setAttributes( { src: undefined, id: undefined } );
				switchToEditing();
				return;
			}
			// sets the block's attribute and updates the edit component from the
			// selected media, then switches off the editing UI
			setAttributes( { src: media.url, id: media.id } );
			this.setState( { src: media.url, editing: false } );
		};
		if ( editing ) {
			return (
				<div>
					<RichText
						tagName="h4"
						className="mediaundertitle"
						placeholder="Pretítulo"
						value={ undertitle }
						onChange={ ( undertitle ) => setAttributes( { undertitle } ) }
					/>
					<RichText
						tagName="h2"
						className="mediatitle"
						placeholder="Título del podcast"
						value={ title }
						onChange={ ( title ) => setAttributes( { title } ) }
					/>
					<RichText
						tagName="p"
						className="mediadescription"
						placeholder="Descripción"
						value={ description }
						onChange={ ( description ) => setAttributes( { description } ) }
					/>
					<RichText
						tagName="h4"
						className="mediaauthor"
						placeholder="Autor"
						value={ author }
						onChange={ ( author ) => setAttributes( { author } ) }
					/>

					<MediaPlaceholder
						icon="media-audio"
						className={ className }
						onSelect={ onSelectAudio }
						onSelectURL={ this.onSelectURL }
						accept="audio/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ this.props.attributes }
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</div>
			);
		}

		/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<IconButton
							className="components-icon-button components-toolbar__control"
							label={ 'Editar Podcast' }
							onClick={ switchToEditing }
							icon="edit"
						/>
					</Toolbar>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ 'Settings del Podcast' }>
						<ToggleControl
							label={ 'Autoplay' }
							onChange={ this.toggleAttribute( 'autoplay' ) }
							checked={ autoplay }
						/>
						<ToggleControl
							label={ 'Loop' }
							onChange={ this.toggleAttribute( 'loop' ) }
							checked={ loop }
						/>
						<SelectControl
							label={ 'Preload' }
							value={ undefined !== preload ? preload : 'none' }
							// `undefined` is required for the preload attribute to be unset.
							onChange={ ( value ) => setAttributes( { preload: ( 'none' !== value ) ? value : undefined } ) }
							options={ [
								{ value: 'auto', label: 'Auto' },
								{ value: 'metadata', label: 'Metadata' },
								{ value: 'none', label: 'None' },
							] }
						/>
					</PanelBody>
				</InspectorControls>
				<figure className={ className }>
					{ /*
						Disable the audio tag so the user clicking on it won't play the
						file or change the position slider when the controls are enabled.
					*/ }
					<Disabled>
						<audio controls="controls" src={ src } />
					</Disabled>
					{ ( ! RichText.isEmpty( undertitle ) || isSelected ) && (
						<RichText
							tagName="h4"
							className="mediaundertitle"
							placeholder="Pretítulo"
							value={ undertitle }
							onChange={ ( undertitle ) => setAttributes( { undertitle } ) }
						/>
					) }
					{ ( ! RichText.isEmpty( title ) || isSelected ) && (
						<RichText
							tagName="h2"
							className="mediatitle"
							placeholder="Título del podcast"
							value={ title }
							onChange={ ( title ) => setAttributes( { title } ) }
						/>
					) }
					{ ( ! RichText.isEmpty( description ) || isSelected ) && (
						<RichText
							tagName="p"
							className="mediadescription"
							placeholder="Descripción"
							value={ description }
							onChange={ ( description ) => setAttributes( { description } ) }
						/>
					) }
					{ ( ! RichText.isEmpty( author ) || isSelected ) && (
						<RichText
							tagName="h4"
							className="mediaauthor"
							placeholder="Autor"
							value={ author }
							onChange={ ( author ) => setAttributes( { author } ) }
						/>
					) }
				</figure>
			</Fragment>
		);
		/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	}
}

export default withNotices( AudioEdit );
