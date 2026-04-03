import { type ReactNode } from "react"
import { Button } from "@/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as UIDialog,
  DialogContent as UIDialogContent,
} from "@/ui/dialog"

interface DialogProps {
  content: ReactNode
  children: ReactNode
  open?: boolean
}

export const Dialog = ({ content, children, open }: DialogProps) => {
  return (
    <UIDialog open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {content}
    </UIDialog>
  )
}

interface DialogContentProps {
  title?: string
  description?: string
  children?: ReactNode
  onOk?: () => void
  onCancel?: () => void
  okLabel?: string
  cancelLabel?: string
}

const DialogContent = ({
  title,
  description,
  children,
  onOk,
  onCancel,
  okLabel = "OK",
  cancelLabel = "Cancel",
}: DialogContentProps) => {
  return (
    <UIDialogContent>
      {(title || description) && (
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      )}
      {children && <div>{children}</div>}
      {(onOk || onCancel) && (
        <DialogFooter>
          {onCancel && (
            <DialogClose asChild>
              <Button onClick={onCancel} variant="secondary">
                {cancelLabel}
              </Button>
            </DialogClose>
          )}
          {onOk && (
            <DialogClose asChild>
              <Button onClick={onOk}>{okLabel}</Button>
            </DialogClose>
          )}
        </DialogFooter>
      )}
    </UIDialogContent>
  )
}

DialogContent.displayName = "Dialog.Content"
Dialog.Content = DialogContent
