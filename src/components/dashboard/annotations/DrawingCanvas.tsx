import { useCallback, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Circle, Image as KonvaImage, Layer, Rect, Stage, Transformer } from 'react-konva';

import { AnnotationCoordinates, AnnotationType } from '@/types/annotations';

interface DrawingCanvasProps {
  selectedImage: string;
  color: string;
  onAddAnnotation: (coords: AnnotationCoordinates) => void;
  annotation: AnnotationCoordinates | null;
  tool: 'draw' | 'move';
  type: AnnotationType;
}

export function DrawingCanvas({ selectedImage, color, onAddAnnotation, annotation, tool, type }: DrawingCanvasProps) {
  // *@ Component States
  // * Stores the loaded image object
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // * Tracks whether the user is currently drawing
  const [drawing, setDrawing] = useState(false);

  // * Coordinates of the shape currently being drawn
  const [currentRect, setCurrentRect] = useState<AnnotationCoordinates | null>(null);

  // * Stage dimensions for responsiveness
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // *@ Component Refs
  // * Reference to the Konva stage (root container)
  const stageRef = useRef<Konva.Stage>(null);

  // * Reference to the currently selected shape (circle or rect)
  const shapeRef = useRef<Konva.Rect & Konva.Circle>(null);

  // * Reference to the Transformer for resizing/moving shapes
  const transformerRef = useRef<Konva.Transformer>(null);

  // * Reference to the container div for responsive sizing
  const containerRef = useRef<HTMLDivElement>(null);

  // *@ Component Effects
  // * Load and display image when `selectedImage` changes
  useEffect(() => {
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => setImage(img);
    return () => setImage(null); // Clean up when image changes
  }, [selectedImage]);

  // * Adjust the stage size based on container size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { offsetWidth } = containerRef.current;
        // You can calculate height based on the image's aspect ratio if available
        const height = image ? image.height : 600;
        setStageSize({ width: offsetWidth, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image]);

  // * When switching to move mode, attach the transformer to the current shape
  useEffect(() => {
    if (tool === 'move' && shapeRef.current && transformerRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw(); // Redraw the layer
    }
  }, [tool, annotation]);

  // * When annotation or type changes, update shape position/size
  useEffect(() => {
    if (annotation && shapeRef.current) {
      if (type === AnnotationType.circle) {
        // Center-based positioning for circle
        const circle = shapeRef.current as Konva.Circle;
        circle.x(annotation.x + annotation.width / 2);
        circle.y(annotation.y + annotation.height / 2);
        circle.radius(Math.max(annotation.width, annotation.height) / 2);
      } else {
        // Top-left-based positioning for rectangles/squares
        const rect = shapeRef.current as Konva.Rect;
        rect.x(annotation.x);
        rect.y(annotation.y);
        rect.width(annotation.width);
        rect.height(type === AnnotationType.square ? annotation.width : annotation.height);
      }
      transformerRef.current?.forceUpdate(); // Make sure transformer stays in sync
    }
  }, [annotation, type]);

  // *@ Component Handlers
  // * When pointer is pressed, begin drawing (this handles both mouse & touch)
  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (tool !== 'draw') return;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      setDrawing(true);
      setCurrentRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
    },
    [tool]
  );

  // * Update shape dimensions while dragging using pointer events
  const handlePointerMove = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (!drawing || !currentRect || tool !== 'draw') return;
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      let width = pos.x - currentRect.x;
      let height = pos.y - currentRect.y;

      // * If drawing a square or circle, keep aspect ratio
      if (type === AnnotationType.square || type === AnnotationType.circle) {
        const size = Math.max(Math.abs(width), Math.abs(height));
        width = width < 0 ? -size : size;
        height = height < 0 ? -size : size;
      }

      // * Update the current rectangle with new size
      setCurrentRect((prev) => prev && { ...prev, width, height });
    },
    [drawing, currentRect, tool, type]
  );

  // * Finish drawing when pointer is released
  const handlePointerUp = useCallback(() => {
    if (currentRect && currentRect.width !== 0 && currentRect.height !== 0) {
      onAddAnnotation(currentRect); // Save the drawn annotation
    }
    setDrawing(false);
    setCurrentRect(null);
  }, [currentRect, onAddAnnotation]);

  // * When a shape is moved or resized, update annotation
  const handleTransformEnd = useCallback(() => {
    if (!shapeRef.current || !annotation) return;

    const node = shapeRef.current;
    let newCoords: AnnotationCoordinates;

    if (type === AnnotationType.circle) {
      // * Calculate bounding box for circle
      const radius = (node as Konva.Circle).radius();
      newCoords = {
        x: node.x() - radius,
        y: node.y() - radius,
        width: radius * 2,
        height: radius * 2,
      };
    } else {
      // * Calculate scaled dimensions for rectangle/square
      newCoords = {
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
      };
      if (type === AnnotationType.square) newCoords.height = newCoords.width;
    }

    // Reset scale after applying
    node.scaleX(1);
    node.scaleY(1);

    onAddAnnotation(newCoords); // Update annotation
  }, [annotation, onAddAnnotation, type]);

  return (
    // The container div ensures responsiveness by taking 100% of its parent's width.
    <div ref={containerRef} style={{ width: '100%', border: '1px solid #ccc' }}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        // Use pointer event handlers for comprehensive mobile and desktop support
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Layer>
          {/* Render the selected background image */}
          {image && <KonvaImage image={image} />}

          {/* Preview shape while drawing */}
          {currentRect &&
            tool === 'draw' &&
            (type === AnnotationType.circle ? (
              <Circle
                x={currentRect.x + currentRect.width / 2}
                y={currentRect.y + currentRect.height / 2}
                radius={Math.max(Math.abs(currentRect.width), Math.abs(currentRect.height)) / 2}
                stroke={color}
                strokeWidth={2}
              />
            ) : (
              <Rect
                x={currentRect.x}
                y={currentRect.y}
                width={currentRect.width}
                height={type === AnnotationType.square ? currentRect.width : currentRect.height}
                stroke={color}
                strokeWidth={2}
              />
            ))}

          {/* Render the selected/active annotation */}
          {annotation &&
            (type === AnnotationType.circle ? (
              <Circle
                ref={shapeRef as React.RefObject<Konva.Circle>}
                x={annotation.x + annotation.width / 2}
                y={annotation.y + annotation.height / 2}
                radius={Math.max(annotation.width, annotation.height) / 2}
                stroke={color}
                strokeWidth={2}
                draggable={tool === 'move'}
                onDragEnd={handleTransformEnd}
              />
            ) : (
              <Rect
                ref={shapeRef as React.RefObject<Konva.Rect>}
                x={annotation.x}
                y={annotation.y}
                width={annotation.width}
                height={type === AnnotationType.square ? annotation.width : annotation.height}
                stroke={color}
                strokeWidth={2}
                draggable={tool === 'move'}
                onDragEnd={handleTransformEnd}
                onTransformEnd={handleTransformEnd}
              />
            ))}

          {/* Show transformer tool if in move mode */}
          {tool === 'move' && annotation && (
            <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => newBox} />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
