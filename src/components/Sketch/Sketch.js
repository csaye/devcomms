import React, { useState } from 'react';

import Pixel from '../Pixel/Pixel.js';

import BrushIcon from '@material-ui/icons/Brush';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import './Sketch.css';

const boardSizePixels = 20;
const pixelSize = 8;
const boardSize = boardSizePixels * pixelSize;
const pixelCount = boardSizePixels * boardSizePixels;

function Sketch() {
  const [mouseDown, setMouseDown] = useState(false);

  const sketchQuery = firebase.firestore().collection('sketches').doc('sketch');
  const [sketchData] = useDocumentData(sketchQuery);

  const pixels = [];
  for (let i = 0; i < pixelCount; i++) pixels.push(i);

  async function clearSketch() {
    let pixelList = '';
    for (let i = 0; i < pixelCount; i++) pixelList += '0';
    await sketchQuery.update({
      pixels: pixelList
    })
  }

  return (
    <div className="Sketch">
      <h1><BrushIcon /> Sketch</h1>
      {
        sketchData ?
        <div
          className="sketch-board"
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
          onMouseLeave={() => setMouseDown(false)}
          style={{"width": `${boardSize}px`}}
        >
          {
            pixels.map(i =>
              <Pixel
                key={`pixel-${i}`}
                id={i}
                filled={sketchData.pixels[i] === '1'}
                mouseDown={mouseDown}
                pixelSize={pixelSize}
              />
            )
          }
        </div> :
        <p>Loading sketch...</p>
      }
      <button onClick={clearSketch}>Clear</button>
    </div>
  );
}

export default Sketch;