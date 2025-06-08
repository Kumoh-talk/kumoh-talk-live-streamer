import { Button } from '@/components/common';
import {
  VideoPreview,
  DeviceSelect,
  WebcamPreview,
  Footer,
  ControlSection,
  ChatPanel,
  QnaPanel,
} from '@/components/main';
import { StreamProvider } from '@/context/context';

export const MainPage = () => {
  return (
    <StreamProvider>
      <div className="flex flex-col gap-2 p-2 h-dvh w-dvw bg-gray-100">
        <section className="flex flex-row gap-2 items-stretch flex-1 h-0">
          <ChatPanel />
          <div className="main-preview w-fit bg-white rounded-lg overflow-hidden">
            <VideoPreview />
          </div>
          <QnaPanel />
        </section>
        <section className="flex flex-row gap-2 h-80">
          <div className="flex flex-col items-stretch w-[423px] p-2 gap-2 bg-white rounded-lg">
            <div className="flex flex-row items-center">
              <span className="w-32 px-2">방송제목</span>
              <div className="flex flex-row items-center gap-2 flex-1">
                <input type="text" className="w-0 flex-1" placeholder="방송 제목을 입력하세요." />
                <Button>저장</Button>
              </div>
            </div>
            <DeviceSelect />
          </div>
          <div className="cam-preview w-0 flex flex-1 justify-center bg-white rounded-lg overflow-hidden">
            <WebcamPreview />
          </div>
          <ControlSection />
        </section>
        <Footer />
      </div>
    </StreamProvider>
  );
};
