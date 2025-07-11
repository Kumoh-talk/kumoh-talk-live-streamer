import { Qna } from '@/types/stream';
import { CheckRounded, ThumbUpRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';

export interface Props {
  item: Qna;
  onDelete?: (qnaId: number) => void;
}

export const QnaItem = (props: Props) => {
  return (
    <motion.li
      className="flex flex-col p-4 gap-3 rounded-lg border border-gray-300"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      layout
    >
      <header className="flex flex-row justify-between items-center w-full leading-none">
        <span className="font-medium text-sm">{props.item.nickname || '익명'}</span>
        <div className="flex flex-row items-center gap-2">
          <button onClick={() => props.onDelete?.(props.item.qnaId)} className='cursor-pointer'>
            <CheckRounded fontSize="small" />
          </button>
        </div>
      </header>
      <section>{props.item.content}</section>
      <div className="flex flex-row justify-between items-center text-sm text-gray-500">
        <button className="flex flex-row items-center gap-1">
          <ThumbUpRounded className="w-4 max-w-4 max-h-4" />
          <span>{props.item.likes}</span>
        </button>
        <span>
        </span>
      </div>
    </motion.li>
  );
};

// const CreatedTime = (props: { time: string }) => {
//   const [timeString, setTimeString] = useState('');
//   useEffect(() => {
//     const updateTimeString = () => {
//       setTimeString(formatRelativeTime(props.time));
//     };
//     updateTimeString();
//     const interval = setInterval(updateTimeString, 3000);
//     return () => clearInterval(interval);
//   }, [props.time]);
//   return timeString;
// };
