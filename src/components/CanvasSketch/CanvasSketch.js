import React, { useRef, useEffect, useState } from 'react';

import BrushIcon from '@material-ui/icons/Brush';

import firebase from 'firebase/app';

import './CanvasSketch.css';

const width = 256;
const height = 256;

let lineColor = 'black';
let lineWidth = 2;
let prevX = 0, prevY = 0, currX = 0, currY = 0;
let drawing = false;

let canvas;
let ctx;

function CanvasSketch() {

  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef();
  const downloadRef = useRef();

  function draw() {

    // draw path
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  }

  function sketch(operation, e) {

    // if mouse down, start drawing
    if (operation === 'down') drawing = true;

    // if not drawing, return
    if (!drawing) return;

    // get previous and current mouse positions
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    // if moving mouse, draw
    if (operation === 'move') draw();
  }

  // clears canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, width, height);

    // update sketch in firebase
    updateSketch();
  }

  // downloads canvas as a png
  function downloadCanvas() {
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'sketch.png');
    canvas.toBlob(blob => {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
  }

  }

  // get canvas and context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas?.getContext('2d');
  }, [])

  return (
    <div className="CanvasSketch">
      <h1><BrushIcon /> Sketch</h1>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={e => sketch('move', e)}
        onMouseDown={e => sketch('down', e)}
        onMouseUp={e => {drawing = false; updateSketch();}}
        onMouseLeave={e => {drawing = false; updateSketch();}}
      />
      {
        loaded ?
        <div>
          <button onClick={clearCanvas}>Clear</button>
          <button onClick={downloadCanvas} ref={downloadRef}>
            Download
          </button>
        </div> :
        <p>Loading sketch...</p>
      }
    </div>
  );
}

export default CanvasSketch;