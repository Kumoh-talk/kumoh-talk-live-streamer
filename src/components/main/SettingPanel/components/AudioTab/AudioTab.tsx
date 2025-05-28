import { InputForm, InputGroup } from '@/components/common';
import { useStreamActions, useStreamValue } from '@/context/context';

const audioCodecs = ['aac'];
const audioBitrates = [64, 96, 128, 160, 192, 256, 320];

export const AudioTab = () => {
  const { audioCodec, audioBitrate } = useStreamValue();
  const { setAudioCodec, setAudioBitrate } = useStreamActions();

  const audioCodecOptions = audioCodecs.map((codec) => (
    <option key={codec} value={codec}>
      {codec.toUpperCase()}
    </option>
  ));

  const audioBitrateOptions = audioBitrates.map((bitrate) => (
    <option key={bitrate} value={bitrate}>
      {bitrate} Kbps
    </option>
  ));
  return (
    <>
      <InputGroup label="오디오">
        <InputForm label="코덱">
          <select
            className="w-80"
            value={audioCodec}
            onChange={(e) => setAudioCodec(e.target.value, audioBitrate)}
          >
            {audioCodecOptions}
          </select>
        </InputForm>
        <InputForm label="비트레이트">
          <select
            className="w-80"
            value={audioBitrate}
            onChange={(e) => setAudioBitrate(Number(e.target.value))}
          >
            {audioBitrateOptions}
          </select>
        </InputForm>
      </InputGroup>
    </>
  );
};
