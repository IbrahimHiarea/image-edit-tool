import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
} from '@mui/material';
import type { DialogProps } from '@mui/material';

interface AppDialogProps extends DialogProps {
  title: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
  isLoading?: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    width: '100%',
  },
}));

export function FormDialog({
  open,
  title,
  onConfirm,
  onClose,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  maxWidth = 'md',
  children,
  isLoading = false,
  ...props
}: AppDialogProps) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
      {...props}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm();
        }}
      >
        <DialogTitle id="alert-dialog-title" variant="h6">
          {title}
        </DialogTitle>

        <DialogContent>{children}</DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={onClose} variant="text" color="inherit">
            {cancelText}
          </Button>
          <Button disabled={isLoading} variant="contained" color={confirmColor} type="submit">
            {isLoading ? <CircularProgress size={24} color="inherit" /> : confirmText}
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
}
