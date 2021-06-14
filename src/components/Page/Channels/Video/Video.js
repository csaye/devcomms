import React, { useRef, useState } from 'react';
import Peer from 'peerjs';

import VideocamIcon from '@material-ui/icons/Videocam';

import firebase from 'firebase/app';

import './Video.css';

let localStream = null;
let localVideo = null;
let localPeer = null;

function Video(props) {
  const [streaming, setStreaming] = useState(false);

  const videoGridRef = useRef();

  // creates and returns a video object streaming from given stream
  function addVideoStream(stream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsinline = true;
    const videoGrid = videoGridRef.current;
    videoGrid.append(video);
    return video;
  }

  // starts local connection, stream, and video
  async function startVideo() {
    // create local stream with video and audio
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // create local video with local stream
    localVideo = document.createElement('video');
    addVideoStream(localVideo, localStream);
    // set up local peer
    localPeer = new Peer();
    localPeer.on('open', () => setStreaming(true));

    localPeer.on('call', call => {
      call.answer(localStream);
      const video = document.createElement('video');
      call.on('stream', remoteStream => {
        addVideoStream(video, remoteStream);
      });
    })
  }

  // stops local connection, stream, and video
  function stopWebcam() {
    // close local connection
    localConnection.close();
    // stop streaming each track
    localStream.getTracks().forEach(track => {
      track.stop();
    });
    // remove local video
    localVideo.remove();
    setStreaming(false);
  }

  return (
    <div className="Video">
      <h1><VideocamIcon /> Video</h1>
      <div className="video-grid" ref={videoGridRef}></div>
      {
        streaming ?
        <button onClick={stopWebcam}>Stop Webcam</button> :
        <button onClick={startWebcam}>Start Webcam</button>
      }
    </div>
  );
}

export default Video;
