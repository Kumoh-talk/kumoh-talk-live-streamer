import { useEffect, useRef, useState } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const [gain, setGain] = useState(0.5);
  const [level, setLevel] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const audioContext = new AudioContext();

    // gain 노드 생성
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5;
    gainNodeRef.current = gainNode;

    // 모니터링 노드 생성
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    analyzerRef.current = analyzer;
    gainNode.connect(analyzer);

    // 목적지 노드 생성
    const destination = audioContext.createMediaStreamDestination();
    gainNode.connect(destination);
    destinationRef.current = destination;
    setAudioStream(destination.stream);

    // 입력 오디오 스트림 설정
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const inputNode = audioContext.createMediaStreamSource(stream);
      inputNode.connect(gainNode);
      inputNodeRef.current = inputNode;
    });

    audioContextRef.current = audioContext;

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    const updateAudioLevel = () => {
      analyzer.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      setLevel(average / 255);
    };
    const loop = setInterval(() => {
      updateAudioLevel();
    }, 1000 / 10);

    return () => {
      clearInterval(loop);
      audioContext.close();
      gainNode.disconnect();
      inputNodeRef.current?.disconnect();
      analyzer.disconnect();
    };
  }, []);

  // gain 조절
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = gain;
      console.log(`Gain set to: ${gain}`);
    }
  }, [gain]);

  return {
    gain,
    level,
    audioStream,
    setGain,
  };
};
