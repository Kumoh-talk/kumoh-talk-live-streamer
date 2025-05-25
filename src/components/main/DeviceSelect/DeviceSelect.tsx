import { useStreamActions, useStreamValue } from '@/context/context';
import { AudioLevelMeter } from '../AudioLevelMeter/AudioLevelMeter';

export const DeviceSelect = () => {
  const { displaySources, displaySource, webcamSources, webcamSource, gain, level } =
    useStreamValue();
  const { setDisplaySource, setWebcamSource, setGain } = useStreamActions();

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
          value={gain}
          onChange={(e) => setGain(parseFloat(e.target.value))}
        />
        <div className="w-full px-0.5">
          <div className="w-full flex flex-col rounded overflow-hidden">
            <AudioLevelMeter className="w-full h-1 border-none bg-gray-300" value={level} />
            <AudioLevelMeter className="w-full h-1 border-none bg-gray-300" value={level} />
          </div>
        </div>
      </div>
    </div>
  );
};
