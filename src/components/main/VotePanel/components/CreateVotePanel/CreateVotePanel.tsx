import { useStreamValue } from '@/context/context';
import useSocketStore from '@/utils/stores/socketStore';
import { createVote } from '@/utils/api/vote';
import { Button } from '@/components/common';
import { useState } from 'react';
import { Vote } from '@/types/stream';
import { AddRounded, DeleteRounded } from '@mui/icons-material';
import { toast } from 'react-toastify';

export interface Props {
  onClose?: () => void;
}
export const CreateVotePanel = (props: Props) => {
  const { streamId } = useStreamValue();
  const { setVoteResult } = useSocketStore();

  const [form, setState] = useState<Omit<Vote, 'voteId'>>({
    title: '',
    multiple: false,
    selects: [],
  });

  const [selects, setSelects] = useState<string[]>(['']);

  const updateForm = (key: keyof Omit<Vote, 'voteId'>, value: string | boolean) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = (vote: Omit<Vote, 'voteId'>) => {
    if (selects.length < 2) {
      toast.warn('투표 항목은 최소 2개 이상이어야 합니다.');
      return;
    }
    createVote(streamId, {
      title: vote.title,
      multiple: vote.multiple,
      selects,
    });
    setVoteResult({
      voteId: 0,
      voteCounts: [],
    });
    props.onClose?.();
  };

  const options = selects.map((content, index) => (
    <SelectItem
      key={index}
      index={index + 1}
      title={content}
      onChange={(value) => {
        const newSelects = [...selects];
        newSelects[index] = value;
        setSelects(newSelects);
      }}
      onDelete={() => {
        const newSelects = selects.filter((_, i) => i !== index);
        setSelects(newSelects);
      }}
    />
  ));

  return (
    <section className="flex flex-col gap-4 w-full h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <input
        type="text"
        name="title"
        placeholder="투표 제목"
        value={form.title}
        onChange={(e) => updateForm('title', e.target.value)}
      />
      <div className="flex flex-col gap-2">{options}</div>
      <Button
        onClick={() => {
          setSelects([...selects, '']);
        }}
      >
        <AddRounded />
      </Button>
      <div className="flex flex-row gap-2">
        <label className="flex flex-row items-center gap-2 px-2">
          <input
            type="checkbox"
            name="multiple"
            checked={form.multiple}
            onChange={(e) => updateForm('multiple', e.target.checked)}
            className="size-4"
          />
          복수 선택 가능
        </label>
        <Button onClick={() => onSubmit(form)} className="flex-1 w-0">
          투표 시작
        </Button>
      </div>
    </section>
  );
};

export interface SelectItemProps {
  title: string;
  index: number;
  onChange: (value: string) => void;
  onDelete?: () => void;
}
export const SelectItem = (props: SelectItemProps) => {
  return (
    <li className="list-none flex flex-row gap-2 items-center">
      <span className="w-6 text-center font-medium">{props.index}</span>
      <input
        type="text"
        name="title"
        value={props.title}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-0 flex-1"
      />
      <Button onClick={props.onDelete} className="px-2">
        <DeleteRounded fontSize="small" />
      </Button>
    </li>
  );
};
