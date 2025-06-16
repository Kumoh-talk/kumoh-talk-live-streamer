import { Vote, VoteResult } from '@/types/stream';
import { motion } from 'framer-motion';

export interface Props {
  item: Vote;
  result?: VoteResult;
}

export const VoteItem = (props: Props) => {
  console.log(props.result)
  const allCount = props.result?.voteCounts?.reduce((acc, vote) => acc + vote.count, 0) ?? 1;
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
        <span className="font-medium text-sm">{props.item.title}</span>
      </header>
      {props.item.selects.map((select, index) => (
        <li key={index} className="flex flex-col w-full gap-2">
          <div className="flex flex-row justify-between items-center">
            <span className="text-sm">{select.content}</span>
            {props.result && (
              <span className="text-sm text-gray-500">
                {props.result.voteCounts?.find((vote) => select.selectId === vote.selectId)?.count ??
                  0}
                표
              </span>
            )}
          </div>
          <div className="flex h-2 rounded-sm w-full bg-gray-400">
            {props.result && (
              <div
                className="bg-blue-500 h-full rounded-sm"
                style={{
                  width: `${
                    allCount > 0
                      ? (props.result.voteCounts?.find((vote) => select.selectId === vote.selectId)
                          ?.count ?? 0) / allCount
                      : 0
                  }%`,
                }}
              />
            )}
          </div>
        </li>
      ))}
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
