import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton, // Added IconButton
  styled,
} from '@mui/material';
import type { DialogProps } from '@mui/material';
import { X } from '@phosphor-icons/react'; // Import X icon

interface AppDialogProps extends DialogProps {
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
  isLoading?: boolean;
  withButtons?: boolean;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    width: '100%',
  },
}));

export function AppDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  maxWidth = 'md',
  children,
  isLoading = false,
  withButtons = true,
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
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 2,
        }}
      >
        {title}
        <IconButton onClick={onClose} aria-label="close" sx={{ marginLeft: 'auto' }}>
          <X size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        {children}
      </DialogContent>

      {withButtons && (
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={onClose} variant="text" color="inherit">
            {cancelText}
          </Button>
          <Button
            onClick={async () => {
              onConfirm && (await onConfirm());
              onClose();
            }}
            variant="contained"
            color={confirmColor}
            autoFocus
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : confirmText}
          </Button>
        </DialogActions>
      )}
    </StyledDialog>
  );
}
