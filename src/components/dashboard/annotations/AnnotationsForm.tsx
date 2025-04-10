import { useCallback, useEffect, useState } from 'react';
import { Grid, IconButton, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ArrowUUpLeft, Circle, Hand, PaintBrush, Rectangle, Square } from '@phosphor-icons/react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';

import { AnnotationCoordinates, AnnotationType } from '@/types/annotations';
import { IImageDto } from '@/types/images';
import { AutoCompleteInputField } from '@/components/sharedComponents/input/AutoCompleteInputField';
import { ColorPickerInputField } from '@/components/sharedComponents/input/ColorPickerInputField';

import { AnnotationFormValues } from './AddAnnotations';
import { DrawingCanvas } from './DrawingCanvas';

interface ImageFormProps {
  control: Control<AnnotationFormValues>;
  images: IImageDto[];
  setValue: UseFormSetValue<AnnotationFormValues>;
}

export function AnnotationsForm({ control, images, setValue }: ImageFormProps) {
  // *@ Component States
  const [annotation, setAnnotation] = useState<AnnotationCoordinates | null>(null);
  // the history for the undo
  const [history, setHistory] = useState<AnnotationCoordinates[]>([]);
  // to select or draw
  const [tool, setTool] = useState<'draw' | 'move'>('draw');

  const selectedImageId = useWatch({ control, name: 'imageId' });
  const color = useWatch({ control, name: 'color' });
  const type = useWatch({ control, name: 'type' });

  // get the image url
  const selectedImage = images.find((img) => img.id === selectedImageId)?.url || '';

  // *@ Component Effect
  useEffect(() => {
    const coordinates = control._formValues.coordinates;
    if (coordinates && coordinates.x !== 0 && coordinates.y !== 0) {
      setAnnotation(coordinates);
    }
  }, [control._formValues.coordinates]);

  // *@ Component Handlers
  // Handle adding new annotation
  const handleAddAnnotation = useCallback(
    (coords: AnnotationCoordinates) => {
      setHistory((prev) => [...prev, annotation || { x: 0, y: 0, width: 0, height: 0 }]);
      setAnnotation(coords);
      setValue('coordinates', coords);
      setValue('type', type);
    },
    [annotation, setValue, type]
  );

  // Handle undo action
  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;

      setAnnotation(last);
      setValue('coordinates', last);
      return prev.slice(0, -1);
    });
  }, [setValue]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid mt={0} container spacing={2} alignItems="center">
          <Grid item xs={12} md={1}>
            <IconButton onClick={handleUndo} disabled={history.length === 0}>
              <ArrowUUpLeft />
            </IconButton>
          </Grid>

          <Grid item xs={12} md={3}>
            <ToggleButtonGroup value={tool} exclusive onChange={(_, newTool) => newTool && setTool(newTool)}>
              <ToggleButton value="draw" selected={tool === 'draw'}>
                <PaintBrush size={20} />
              </ToggleButton>
              <ToggleButton value="move" selected={tool === 'move'}>
                <Hand size={20} />
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(_, newType) => newType && setValue('type', newType)}
              sx={{ ml: 2 }}
            >
              <ToggleButton value={AnnotationType.rectangle}>
                <Rectangle size={20} />
              </ToggleButton>
              <ToggleButton value={AnnotationType.square}>
                <Square size={20} />
              </ToggleButton>
              <ToggleButton value={AnnotationType.circle}>
                <Circle size={20} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12} md={4}>
            <AutoCompleteInputField
              name="imageId"
              control={control}
              options={images}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Image"
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <ColorPickerInputField name="color" control={control} label="Color" defaultValue={color} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={2} sx={{ border: '1px solid #ccc', p: 2 }}>
          {selectedImage && (
            <DrawingCanvas
              selectedImage={selectedImage}
              color={color}
              onAddAnnotation={handleAddAnnotation}
              annotation={annotation}
              tool={tool}
              type={type}
            />
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
