import { useDraggable } from '@dnd-kit/react';
import type { DraggableTaskType } from '../types/draggableTaskType';
import InlineInput from './InlineInput';
import Button from './Button';
import { Trash2 } from 'lucide-react';

const DraggableTask = ({ task, handleUpdateTask, handleDeleteTask }: DraggableTaskType) => {
  const { ref, isDragging } = useDraggable({
    id: task._id,
    data: {
      task: task,
    },
  });
  const inlineStyle = {
    transition: isDragging ? 'none' : 'transform 150ms ease, opacity 150ms ease',
    opacity: isDragging ? 0.6 : 1,
    cursor: 'grab',
  };
  return (
    <div key={task._id} ref={ref} style={inlineStyle} className={isDragging ? 'dragging' : ''}>
      <InlineInput
        value={task.task}
        onSave={(updatedText) => handleUpdateTask(updatedText, task._id)}
      />
      <Button id={task._id} fn={() => handleDeleteTask(task._id)}>
        <Trash2 />
      </Button>
    </div>
  );
};

export default DraggableTask;
