import { FileIcon, TrashIcon, UploadCloudIcon } from 'lucide-react';
import * as React from 'react';
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/utils/common';
import ImageZoom from './image-zoom';

export class UploadError extends Error {
  toastContent: React.ReactNode;

  constructor(message: string, toastContent?: React.ReactNode) {
    super(message);
    this.name = 'UploadError';
    this.toastContent = toastContent ?? message;
  }
}

export interface InputFileDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[];

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept'];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize'];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps['maxFiles'];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
}

export function InputFileDropzone(props: InputFileDropzoneProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const { t } = useTranslation();
  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error(t('upload.too-many-single'));
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(t('upload.too-many', { count: maxFiles }));
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(t('upload.rejected', { name: file.name }));
        });
      }

      if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
        const count = updatedFiles.length;

        toast.promise(onUpload(updatedFiles), {
          loading: t('upload.uploading', { count }),
          success: () => {
            setFiles([]);
            return t('upload.uploaded', { count });
          },
          error: (err: unknown) => (err instanceof UploadError ? err.toastContent : t('upload.failed', { count })),
        });
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles, t]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden'>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-paper/25 border-dashed px-5 py-2.5 text-center transition hover:bg-paper/25',
              'text-foreground ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadCloudIcon className='size-7' aria-hidden='true' />
                </div>
                <p className='font-medium'>{t('upload.drop-here')}</p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadCloudIcon className='size-7' aria-hidden='true' />
                </div>
                <div className='space-y-px'>
                  <p className='font-medium'>{t('upload.drag-or-click')}</p>
                  <p className='text-foreground/70 text-sm'>
                    {maxFiles === Number.POSITIVE_INFINITY
                      ? t('upload.limit-unlimited', { size: formatBytes(maxSize) })
                      : maxFiles > 1
                        ? t('upload.limit-many', { count: maxFiles, size: formatBytes(maxSize) })
                        : t('upload.limit-single', { size: formatBytes(maxSize) })}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className='h-fit w-full px-3'>
          <div className='max-h-48 space-y-4'>
            {files?.map((file, index) => (
              <FileCard
                key={`${index}-${file.name}`}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  const { t } = useTranslation();
  return (
    <div className='relative flex items-center space-x-4'>
      <div className='flex flex-1 space-x-4'>
        {isFileWithPreview(file) ? (
          <ImageZoom className='border'>
            <img
              src={file.preview}
              alt={file.name}
              width={48}
              height={48}
              loading='lazy'
              className='aspect-square shrink-0 rounded-md object-cover'
            />
          </ImageZoom>
        ) : (
          <div className='flex aspect-square size-12 shrink-0 items-center justify-center rounded-md border bg-muted'>
            <FileIcon className='size-6 text-muted-foreground' />
          </div>
        )}
        <div className='flex w-full flex-col gap-2'>
          <div className='space-y-px'>
            <p className='line-clamp-1 font-medium text-foreground/80 text-sm'>{file.name}</p>
            <p className='text-foreground text-xs'>{formatBytes(file.size)}</p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={onRemove}
          disabled={progress !== undefined && progress < 100}
          className='size-8 rounded-full'
        >
          <TrashIcon className='text-foreground' />
          <span className='sr-only'>{t('a11y.remove-file')}</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string' && file.type.startsWith('image/');
}
