import { useStreamActions, useStreamValue } from '@/context/context';
import { useEffect, useRef, useState } from 'react';
import { AudioLevelMeter } from '../AudioLevelMeter/AudioLevelMeter';

export const DeviceSelect = () => {
  const { displaySources, displaySource, webcamSources, webcamSource } = useStreamValue();
  const { setDisplaySource, setWebcamSource } = useStreamActions();
  const [masterInputGain, setMasterInputGain] = useState(0.5);
  const [masterInputLevel, setMasterInputLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      gainNodeRef.current = null;
      inputNodeRef.current = null;
      analyzerRef.current = null;
    }
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    gainNodeRef.current = gainNode;
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    analyzerRef.current = analyzer;
    gainNode.connect(analyzer);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const inputNode = audioContext.createMediaStreamSource(stream);
      inputNode.connect(analyzer);
      inputNodeRef.current = inputNode;
    });

    audioContextRef.current = audioContext;

    return () => {
      audioContext.close();
      gainNode.disconnect();
      inputNodeRef.current?.disconnect();
      analyzer.disconnect();
    };
  }, []);
  useEffect(() => {
    const analyzer = analyzerRef.current;
    if (!analyzer) return;

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    const updateAudioLevel = () => {
      analyzer.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      setMasterInputLevel(average / 255); // Normalize to 0-1 range
    };
    const loop = setInterval(() => {
      updateAudioLevel();
    }, 1000 / 30); // Update at 30 FPS
    return () => {
      clearInterval(loop);
    };
  }, [analyzerRef.current]);

  const displayOptions = displaySources.map((source) => {
    return (
      <option key={source.id} value={source.id}>
        {source.name}
      </option>
    );
  });
  const webcamOptions = webcamSources.map((source) => {
    return (
      <option key={source.id} value={source.id}>
        {source.name}
      </option>
    );
  });
  return (
    <div className="flex flex-col items-stretch gap-2">
      <div className="flex flex-row items-center">
        <span className="w-32 px-2">발표 화면 선택</span>
        <select
          className="w-0 flex-1"
          value={displaySource}
          onChange={(e) => setDisplaySource(e.target.value)}
        >
          {displayOptions}
        </select>
      </div>
      <div className="flex flex-row items-center">
        <span className="w-32 px-2">카메라 선택</span>
        <select
          className="w-0 flex-1"
          value={webcamSource}
          onChange={(e) => setWebcamSource(e.target.value)}
        >
          {webcamOptions}
        </select>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 w-full">
        <input
          className="w-full tiny"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={masterInputGain}
          onChange={(e) => setMasterInputGain(parseFloat(e.target.value))}
        />
        <div className="w-full px-0.5">
          <div className="w-full flex flex-col rounded overflow-hidden">
            <AudioLevelMeter
              className="w-full h-1 border-none bg-gray-300"
              value={masterInputLevel}
            />
            <AudioLevelMeter
              className="w-full h-1 border-none bg-gray-300"
              value={masterInputLevel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
