import { InputForm, InputGroup } from '@/components/common';
import { useStreamActions, useStreamValue } from '@/context/context';

const videoCodecs = [
  {
    name: 'H.264 (CPU)',
    codec: 'libx264',
    preset: [
      'ultrafast',
      'superfast',
      'veryfast',
      'faster',
      'fast',
      'medium',
      'slow',
      'slower',
      'veryslow',
    ],
  },
  {
    name: 'H.264 (NVIDIA)',
    codec: 'h264_nvenc',
    preset: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
  },
  {
    name: 'H.264 (Intel Quick Sync)',
    codec: 'h264_qsv',
    preset: ['veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'],
  },
];
const resolutions = ['1920x1080', '1280x720', '960x540', '640x360', '426x240', '320x180'];
const frameRates = [10, 24, 30, 60];

export const VideoTab = () => {
  const {
    videoCodec,
    videoDesktopResolution,
    videoWebcamResolution,
    videoDesktopBitrate,
    videoWebcamBitrate,
  } = useStreamValue();
  const {
    setVideoCodec,
    setVideoDesktopResolution,
    setVideoWebcamResolution,
    setVideoDesktopBitrate,
    setVideoWebcamBitrate,
  } = useStreamActions();

  const videoCodecOptions = videoCodecs.map((codec) => (
    <option key={codec.codec} value={codec.codec}>
      {codec.name}
    </option>
  ));

  const videoPresetOptions = videoCodecs
    .find((c) => c.codec === videoCodec.codec)!
    .preset.map((preset) => (
      <option key={preset} value={preset}>
        {preset}
      </option>
    ));

  const resolutionOptions = resolutions.map((res) => (
    <option key={res} value={res}>
      {res}
    </option>
  ));

  const frameRateOptions = frameRates.map((rate) => (
    <option key={rate} value={rate}>
      {rate} FPS
    </option>
  ));
  return (
    <>
      <InputForm label="비디오 코덱">
        <select
          className="w-80"
          value={videoCodec.codec}
          onChange={(e) =>
            setVideoCodec(
              e.target.value,
              e.target.value === videoCodec.codec
                ? videoCodec.preset
                : videoCodecs.find((c) => c.codec === e.target.value)!.preset[0]
            )
          }
        >
          {videoCodecOptions}
        </select>
      </InputForm>
      <InputForm label="프리셋">
        <select
          className="w-80"
          value={videoCodec.preset}
          onChange={(e) => setVideoCodec(videoCodec.codec, e.target.value)}
        >
          {videoPresetOptions}
        </select>
      </InputForm>
      <InputGroup label="메인 영상">
        <InputForm label="해상도">
          <select
            className="w-80"
            value={videoDesktopResolution.width + 'x' + videoDesktopResolution.height}
            onChange={(e) => {
              const [width, height] = e.target.value.split('x').map(Number);
              setVideoDesktopResolution(width, height, videoDesktopResolution.frameRate);
            }}
          >
            {resolutionOptions}
          </select>
        </InputForm>
        <InputForm label="프레임레이트">
          <select
            className="w-80"
            value={videoDesktopResolution.frameRate}
            onChange={(e) => {
              const frameRate = Number(e.target.value);
              setVideoDesktopResolution(
                videoDesktopResolution.width,
                videoDesktopResolution.height,
                frameRate
              );
            }}
          >
            {frameRateOptions}
          </select>
        </InputForm>
        <InputForm label="비트레이트">
          <input
            className="w-80"
            type="number"
            value={videoDesktopBitrate}
            onChange={(e) => setVideoDesktopBitrate(Number(e.target.value))}
          />
        </InputForm>
      </InputGroup>
      <InputGroup label="웹캠 영상">
        <InputForm label="해상도">
          <select
            className="w-80"
            value={videoWebcamResolution.width + 'x' + videoWebcamResolution.height}
            onChange={(e) => {
              const [width, height] = e.target.value.split('x').map(Number);
              setVideoWebcamResolution(width, height, videoWebcamResolution.frameRate);
            }}
          >
            {resolutionOptions}
          </select>
        </InputForm>
        <InputForm label="프레임레이트">
          <select
            className="w-80"
            value={videoWebcamResolution.frameRate}
            onChange={(e) => {
              const frameRate = Number(e.target.value);
              setVideoWebcamResolution(
                videoWebcamResolution.width,
                videoWebcamResolution.height,
                frameRate
              );
            }}
          >
            {frameRateOptions}
          </select>
        </InputForm>
        <InputForm label="비트레이트">
          <input
            className="w-80"
            type="number"
            value={videoWebcamBitrate}
            onChange={(e) => setVideoWebcamBitrate(Number(e.target.value))}
          />
        </InputForm>
      </InputGroup>
    </>
  );
};
