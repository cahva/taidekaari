import {
  component$,
  useStore,
  useSignal,
  useVisibleTask$,
  useComputed$,
  $,
} from "@builder.io/qwik";
import type {
  GetGridWithImagesType,
  GetAllImagesWithGridSizeType,
} from "@lib/grid";
import GridImage from "./grid-image";

interface GridAdminProps {
  data: GetGridWithImagesType;
  allImages: GetAllImagesWithGridSizeType;
  userId: number;
}

const imageBaseUrl = "https://imagedelivery.net/RUkpPV9lzZPhEDf5OZFR8A/";

function sortByGridSize(
  a: GetGridWithImagesType["images"][0],
  b: GetGridWithImagesType["images"][0]
) {
  if (a.gridsize === "10x10" && b.gridsize === "20x20") {
    return -1;
  }

  if (a.gridsize === "20x20" && b.gridsize === "10x10") {
    return 1;
  }

  return 0;
}

export default component$<GridAdminProps>((props) => {
  const { data, allImages } = props;

  if (!data) {
    return null;
  }

  const dropzoneRef = useSignal<HTMLElement>();
  const allImagesStore = useStore(allImages);
  const saveStatus = useSignal("Tallenna");
  const gridStore = useStore(data);
  const gridname = useSignal(gridStore.grid.name);
  const dragginId = useSignal<string | null>(null);

  const unUsedImages = useComputed$(() => {
    return allImagesStore
      .filter(
        (image) =>
          !gridStore.grid.imagePositions.find((img) => img.imageId === image.id)
      )
      .toSorted(sortByGridSize);
  });

  useVisibleTask$(({ cleanup }) => {
    if (dropzoneRef.value) {
      const dropzone = dropzoneRef.value;
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = "move";
        }
      });

      cleanup(() => {
        dropzone.removeEventListener("dragover", () => {});
        dropzone.removeEventListener("drop", () => {});
      });
    }
  });

  const updateImagePosition = $((imageId: string, x: number, y: number) => {
    const image = gridStore.grid.imagePositions.find(
      (img) => img.imageId === imageId
    );

    if (!image) {
      return;
    }

    image.x = x;
    image.y = y;
  });

  const saveGrid = $(() => {
    saveStatus.value = "Tallennetaan...";
    const dataToSend = {
      id: gridStore.grid.id,
      name: gridname.value,
      imagePositions: gridStore.grid.imagePositions,
    };
    fetch("/api/grid/" + gridStore.grid.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    }).then(() => {
      gridStore.grid.name = gridname.value;

      saveStatus.value = "Tallennettu!";
      setTimeout(() => {
        saveStatus.value = "Tallenna";
      }, 2000);
    });
  });

  const removeGrid = $(() => {
    fetch("/api/grid/" + gridStore.grid.id, {
      method: "DELETE",
    }).then(() => {
      document.location.href = "/grid";
    });
  });

  const inputHandler = $((event: InputEvent) => {
    gridname.value = (event.target as HTMLInputElement).value;
  });

  return (
    <div
      id="grid-container"
      class="grid grid-cols-[1fr] grid-rows-[auto_1fr] h-[75vh] divide-y-2 divide-gray-500 divide-dashed"
    >
      <header class="p-3">
        <h2 class="text-center text-xl">{gridStore.grid.name}</h2>
        <h3 class="text-center text-lg">
          Käyttämättömät teokset ({unUsedImages.value.length})
        </h3>
        {unUsedImages.value.length === 0 && (
          <p class="text-center text-green-900 dark:text-green-500">
            Kaikki teokset käytössä
          </p>
        )}
        {unUsedImages.value.length > 0 && (
          <div class="flex gap-3 justify-center">
            {unUsedImages.value.map((image) => (
              <div
                id={image.id}
                key={image.id}
                class={`aspect-1 ${
                  image.gridsize === "10x10" ? "w-10" : "w-20"
                }`}
                draggable={true}
                onDragStart$={(e: DragEvent) => {
                  // Image is dragged so we need to get the parent element id
                  const currentEl = e.target as HTMLElement;

                  // CurrentEl is the image, we want the container div
                  const parent = currentEl.parentElement as HTMLElement;

                  if (!parent) {
                    return;
                  }

                  dragginId.value = parent.id;

                  if (!dragginId.value) {
                    return;
                  }
                }}

              >
                <img
                  src={imageBaseUrl + image.id + "/public"}
                  alt={image.title ?? "kuva"}
                />
              </div>
            ))}
          </div>
        )}
      </header>
      <main
        id="dropzone"
        class="bg-grid-pattern bg-[size_400px] overflow-auto outline-2 outline-red-500"
        ref={dropzoneRef}
        preventdefault:dragover
        preventdefault:drop
        onDrop$={(e: DragEvent, targetEl) => {

          const rect = targetEl.getBoundingClientRect();
          let x = e.clientX - rect.x;
          let y = e.clientY - rect.y;

          if (x < 0) {
            x = 0;
          }

          if (y < 0) {
            y = 0;
          }

          // Snap to grid (0, 40, 80 and so on)
          x = Math.round(x / 40) * 40;
          y = Math.round(y / 40) * 40;

          if (dragginId.value) {
            // Get the size of the image
            const image = allImagesStore.find(
              (img) => img.id === dragginId.value
            );
            if (!image) {
              return;
            }

            // Push the image to the gridStore.grid.imagePositions
            gridStore.grid.imagePositions.push({
              imageId: dragginId.value,
              x,
              y,
              size: image.gridsize === "10x10" ? 10 : 20,
            });

            // Remove dragginId
            dragginId.value = null;
          }
        }}
      >
        {/* lets put the absolute container so we can use the relative positioning */}
        <div class="relative">
          {gridStore.grid.imagePositions.map((pos) => {
            return (
              <GridImage
                url={imageBaseUrl + pos.imageId + "/public"}
                position={pos}
                key={pos.imageId}
                updateImagePosition={updateImagePosition}
              />
            );
          })}
        </div>
      </main>
      <footer class="pt-4">
        {gridStore.grid.userId === props.userId && (
          <div class="flex flex-col gap-4 items-center">
            <label class="dark:text-white text-gray-900 flex flex-col gap-2 text-sm">
              <span>Ruudukon nimi</span>
              <input
                class="w-80 border border-gray-300 rounded-md p-2 text-gray-900"
                type="text"
                value={gridname.value}
                onInput$={inputHandler}
              />
            </label>
            <button
              disabled={gridStore.grid.userId !== props.userId || saveStatus.value === "Tallennetaan..."}
              class="rounded-md bg-amber-700 hover:bg-amber-600 px-3 py-1.5 text-sm w-80 font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              onClick$={() => saveGrid()}
            >
              {saveStatus.value}
            </button>
            <button
              disabled={gridStore.grid.userId !== props.userId}
              class="text-red-500 underline font-semibold"
              onClick$={() => removeGrid()}
            >
              Poista
            </button>
          </div>
        )}
      </footer>
    </div>
  );
});
