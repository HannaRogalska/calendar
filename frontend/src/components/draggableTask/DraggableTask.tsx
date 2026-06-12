import { useDraggable } from '@dnd-kit/react';
import type { DraggableTaskType } from '../../types/draggableTaskType';
import InlineInput from '../InlineInput/InlineInput';
import Button from '../button/Button';
import { Trash2 } from 'lucide-react';
import style from './DraggableTask.module.css';

const DraggableTask = ({ task, handleUpdateTask, handleDeleteTask }: DraggableTaskType) => {
  const { ref, isDragging } = useDraggable({
    id: task._id,
    data: {
      task: task,
    },
  });

  return (
    <div key={task._id} ref={ref} className={style.task}>
      <InlineInput
        value={task.task}
        onSave={(updatedText) => handleUpdateTask(updatedText, task._id)}
      />
      <Button id={task._id} fn={() => handleDeleteTask(task._id)} className={style.button}>
        <Trash2 />
      </Button>
    </div>
  );
};

export default DraggableTask;
