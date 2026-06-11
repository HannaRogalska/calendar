import { useSortable } from "@dnd-kit/react/sortable";
import type { SortableWrapperType } from "../types/sortableItemWrapperType";

const SortableItemWrapper = ({ id, children, index }: SortableWrapperType) => {
  const { ref, isDragging } = useSortable({
    id,
    type: 'item',
    index,
  });
   return <div ref={ref} style={{ opacity: isDragging ? 0.4 : 1 }}>
     {children}
   </div>;
};

export default SortableItemWrapper

