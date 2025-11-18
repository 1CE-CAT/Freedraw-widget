import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { useRef, useState } from "react";

const App = ({ data }: any) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [isLocked, setIsLocked] = useState(false);

  const handleEraserClick = () => {
    if (!isLocked) return;
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    if (!isLocked) return;
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleLockToggle = () => {
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    data?.onLockToggle?.(newLockedState);
  };

  return (
    <div
      style={{
        width: "400px",
        height: "300px",

        // ← ReactFlow перестает взаимодействовать только здесь
        pointerEvents: "none",    
      }}
    >
      <div 
        style={{ 
          pointerEvents: "auto",
          userSelect: "none"
        }}
      >
        <button
          type="button"
          onClick={handleLockToggle}
        >
          {isLocked ? "Fixed" : "Move"}
        </button>

        <label>Stroke color</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          disabled={!isLocked}
        />

        <label>Canvas color</label>
        <input
          type="color"
          value={canvasColor}
          onChange={(e) => setCanvasColor(e.target.value)}
          disabled={!isLocked}
        />

        <button disabled={!eraseMode || !isLocked} onClick={handlePenClick}>
          Pen
        </button>

        <button disabled={eraseMode || !isLocked} onClick={handleEraserClick}>
          Eraser
        </button>

        <label>Stroke width</label>
        <input
          disabled={eraseMode || !isLocked}
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(+e.target.value)}
        />

        <label>Eraser width</label>
        <input
          disabled={!eraseMode || !isLocked}
          type="range"
          min="1"
          max="20"
          value={eraserWidth}
          onChange={(e) => setEraserWidth(+e.target.value)}
        />

        <button disabled={!isLocked} onClick={() => canvasRef.current?.undo()}>
          Undo
        </button>

        <button disabled={!isLocked} onClick={() => canvasRef.current?.redo()}>
          Redo
        </button>

        <button
          disabled={!isLocked}
          onClick={() => canvasRef.current?.clearCanvas()}
        >
          Очистить
        </button>
      </div>

      <ReactSketchCanvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #ccc",

          // ← важно: холст принимает все события мыши
          pointerEvents: "auto",

          // курсор: рисовать/стирать
          cursor: isLocked ? (eraseMode ? "cell" : "crosshair") : "grab",
        }}
        strokeColor={strokeColor}
        canvasColor={canvasColor}
        eraserWidth={eraserWidth}
        strokeWidth={strokeWidth}
      />
    </div>
  );
};

export default App;
