import React, { useEffect, useState } from 'react';
import '@excalidraw/excalidraw/dist/excalidraw.min.css';

const Excalidraw = React.lazy(() =>
  import('@excalidraw/excalidraw').then((mod) => ({
    default: mod.Excalidraw,
  }))
);

interface ExcalidrawViewerProps {
  data: string; // JSON string of scene data
}

export const ExcalidrawViewer: React.FC<ExcalidrawViewerProps> = ({ data }) => {
  const [sceneData, setSceneData] = useState<any>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(data);
      setSceneData(parsed);
    } catch (err) {
      console.error("Invalid Excalidraw JSON", err);
    }
  }, [data]);

  return (
    <div className="my-4 border rounded h-[400px] overflow-hidden">
      <React.Suspense fallback={<div>Loading drawing...</div>}>
        <Excalidraw
          initialData={sceneData}
          viewModeEnabled
          zenModeEnabled
          UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false } }}
        />
      </React.Suspense>
    </div>
  );
};
