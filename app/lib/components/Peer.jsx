import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as appPropTypes from './appPropTypes';
import { withRoomContext } from '../RoomContext';
import * as stateActions from '../redux/stateActions';
import PeerView from './PeerView';

const Peer = (props) =>

{
	const {
		roomClient,
		peer,
		audioConsumer,
		videoConsumer,
		contentConsumer,
		audioMuted,
		faceDetection,
		onSetStatsPeerId
	} = props;

	const audioEnabled = (
		Boolean(audioConsumer) &&
		!audioConsumer.locallyPaused &&
		!audioConsumer.remotelyPaused
	);

	const videoVisible = (
		Boolean(videoConsumer) &&
		!videoConsumer.locallyPaused &&
		!videoConsumer.remotelyPaused
	);
	console.log(props,'props=========================================')
	return (
		<>
			<div data-component='Peer'>
				<div className='indicators'>
					<If condition={!audioEnabled}>
						<div className='icon mic-off' />
					</If>

					<If condition={!videoConsumer}>
						<div className='icon webcam-off' />
					</If>
				</div>

				<PeerView
					peer={peer}
					sharingContent={props.type==='content'}
					audioConsumerId={audioConsumer ? audioConsumer.id : null}
					videoConsumerId={videoConsumer ? videoConsumer.id : null}
					audioRtpParameters={audioConsumer ? audioConsumer.rtpParameters : null}
					videoRtpParameters={videoConsumer ? videoConsumer.rtpParameters : null}
					consumerSpatialLayers={videoConsumer ? videoConsumer.spatialLayers : null}
					consumerTemporalLayers={videoConsumer ? videoConsumer.temporalLayers : null}
					consumerCurrentSpatialLayer={
						videoConsumer ? videoConsumer.currentSpatialLayer : null
					}
					consumerCurrentTemporalLayer={
						videoConsumer ? videoConsumer.currentTemporalLayer : null
					}
					consumerPreferredSpatialLayer={
						videoConsumer ? videoConsumer.preferredSpatialLayer : null
					}
					consumerPreferredTemporalLayer={
						videoConsumer ? videoConsumer.preferredTemporalLayer : null
					}
					consumerPriority={videoConsumer ? videoConsumer.priority : null}
					audioTrack={audioConsumer ? audioConsumer.track : null}
					videoTrack={videoConsumer ? videoConsumer.track : null}
					contentTrack={contentConsumer? contentConsumer.track :null}
					audioMuted={audioMuted}
					videoVisible={videoVisible}
					videoMultiLayer={videoConsumer && videoConsumer.type !== 'simple'}
					audioCodec={audioConsumer ? audioConsumer.codec : null}
					videoCodec={videoConsumer ? videoConsumer.codec : null}
					audioScore={audioConsumer ? audioConsumer.score : null}
					videoScore={videoConsumer ? videoConsumer.score : null}
					contentCodec={contentConsumer ? contentConsumer.codec :null}
					faceDetection={faceDetection}
					onChangeVideoPreferredLayers={(spatialLayer, temporalLayer) =>
					{
						roomClient.setConsumerPreferredLayers(
							videoConsumer.id, spatialLayer, temporalLayer);
					}}
					onChangeVideoPriority={(priority) =>
					{
						if (contentConsumer)
							console.log("contentConsumer ********************************************",contentConsumer);

						roomClient.setConsumerPriority(videoConsumer.id, priority);
					}}
					onRequestKeyFrame={() =>
					{
						roomClient.requestConsumerKeyFrame(videoConsumer.id);
					}}
					onStatsClick={onSetStatsPeerId}
				/>
			</div>		
		</>
		
	);
};

Peer.propTypes =
{
	roomClient       : PropTypes.any.isRequired,
	peer             : appPropTypes.Peer.isRequired,
	audioConsumer    : appPropTypes.Consumer,
	videoConsumer    : appPropTypes.Consumer,
	contentConsumer  : appPropTypes.Consumer,
	audioMuted       : PropTypes.bool,
	faceDetection    : PropTypes.bool.isRequired,
	onSetStatsPeerId : PropTypes.func.isRequired,
	windowType       : PropTypes.bool

};

const mapStateToProps = (state, { id }) =>
{
	const me = state.me;
	const peer = state.peers[id];
	// console.log(id,"id perrs.......................................................");
	const consumersArray = peer.consumers
		.map((consumerId) => state.consumers[consumerId]);
	const audioConsumer =
		consumersArray.find((consumer) => consumer.track.kind === 'audio');
	const videoConsumer =
		consumersArray.find((consumer) => consumer.track.kind === 'video' && !consumer.share);
	const contentConsumer =
		consumersArray.find((consumer) => consumer.track.kind === 'video' && consumer.share);
	return {
		peer,
		audioConsumer,
		videoConsumer,
		contentConsumer,
		audioMuted    : me.audioMuted,
		faceDetection : state.room.faceDetection
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		onSetStatsPeerId : (peerId) => dispatch(stateActions.setRoomStatsPeerId(peerId))
	};
};

const PeerContainer = withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps
)(Peer));

export default PeerContainer;
