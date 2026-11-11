import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/integrations/i18n';

type CommentComposerUiProps = {
  isSaving: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
};

const CommentComposerUi = ({ isSaving, onSave, onCancel }: CommentComposerUiProps) => {
  const { t } = useTranslation('comments');
  const [text, setText] = useState('');
  const submit = () => !isSaving && text.trim() && onSave(text.trim());

  return (
    <div className='space-y-2'>
      <Textarea
        autoFocus
        value={text}
        disabled={isSaving}
        placeholder={t('composer.placeholder')}
        className='min-h-22 px-3 py-2'
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
        }}
      />
      <div className='flex items-center justify-between gap-2'>
        <span className='text-xs text-muted-foreground'>{t('composer.shortcut')}</span>
        <div className='flex gap-2'>
          <Button size='sm' variant='ghost' disabled={isSaving} onClick={onCancel}>
            {t('composer.cancel')}
          </Button>
          <Button size='sm' disabled={isSaving || !text.trim()} onClick={submit}>
            {isSaving ? t('composer.saving') : t('composer.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentComposerUi;
