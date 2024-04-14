import {
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

import type { ImagePosition } from "db/config";

interface GridImageProps {
  url: string;
  position: ImagePosition;
  updateImagePosition: (imageId: string, x: number, y: number) => void;
}

export default component$<GridImageProps>((props) => {
  const { position, updateImagePosition, url } = props;
  const yPos = useSignal(props.position.y);
  const xPos = useSignal(props.position.x);
  const offsetX = useSignal(0);
  const offsetY = useSignal(0);
  const draggableRef = useSignal<HTMLElement>();
  const dragStatus = useSignal('');

  useVisibleTask$(({ cleanup }) => {
    if (draggableRef.value) {
      // Use the DOM API to add an event listener.
      const dragstart = () => (dragStatus.value = 'dragstart');
      const dragend = () => (dragStatus.value = 'dragend');
 
      draggableRef.value!.addEventListener('dragstart', dragstart);
      draggableRef.value!.addEventListener('dragend', dragend);
      cleanup(() => {
        draggableRef.value!.removeEventListener('dragstart', dragstart);
        draggableRef.value!.removeEventListener('dragend', dragend);
      });
    }
  });

  return (
    <div
      class={`aspect-1 ${props.position.size === 10 ? 'w-10' : 'w-20'} absolute cursor-move`}
      key={position.imageId}
      id={position.imageId}
      draggable={true}
      ref={draggableRef}
      onDragStart$={(e: DragEvent) => {
        if (e.target instanceof HTMLElement) {
          const rect = e.target.getBoundingClientRect();

          offsetX.value = e.clientX - rect.x;
          offsetY.value = e.clientY - rect.y;
        }

      }}
      onDragEnd$={(e: DragEvent) => {
        xPos.value = xPos.value - offsetX.value + e.layerX;
        yPos.value = yPos.value - offsetY.value + e.layerY;

        if (yPos.value < 0) {
          yPos.value = 0;
        }

        if (xPos.value < 0) {
          xPos.value = 0;
        }

        // Snap to grid (0, 40, 80 and so on)
        xPos.value = Math.round(xPos.value / 40) * 40;
        yPos.value = Math.round(yPos.value / 40) * 40;

        updateImagePosition(position.imageId, xPos.value, yPos.value);

      }}
      style={{ left: xPos.value + 'px', top: yPos.value + 'px' }}
    >
      <img src={url} alt={position.imageId} />
    </div>
  );
});
