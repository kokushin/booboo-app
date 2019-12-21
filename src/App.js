import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const [audio, setAudio] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const videoEl = useRef(null);

  const onPlay = () => {
    const options = new faceapi.TinyFaceDetectorOptions();
    const loop = setInterval(async () => {
      const result = await faceapi
        .detectSingleFace(
          videoEl.current,
          options,
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      if (result) {
        audio.play();
        setIsCompleted(true);
        clearInterval(loop);
      }
    }, 500);
  };

  useEffect(() => {
    (async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('https://kokushin.github.io/booboo-app/weights');
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://kokushin.github.io/booboo-app/weights');
      await faceapi.nets.faceExpressionNet.loadFromUri('https://kokushin.github.io/booboo-app/weights');

      navigator
        .mediaDevices
        .getUserMedia({ video: {} })
        .then(stream => {
          videoEl.current.srcObject = stream;
          videoEl.current.play();

          setAudio(new Audio('https://kokushin.github.io/booboo-app/assets/audio.mp3'));
        });
    })();
  }, []);

  return (
    <div className="App">
      <h1>booboo-app</h1>
      <p>カメラに写った顔を認識すると音が出ます</p>
      <p>{isCompleted ? '放屁完了' : '認識中...'}</p>
      {isCompleted && (
        <>
          <p>
            <img src="https://kokushin.github.io/booboo-app/assets/image.png" width="320" alt="" />
          </p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </>
      )}
      <video ref={videoEl} onPlay={onPlay} style={{ display: "none" }} />
    </div>
  );
}

export default App;
