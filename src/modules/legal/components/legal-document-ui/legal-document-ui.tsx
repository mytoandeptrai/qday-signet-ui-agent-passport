type LegalDocumentUiProps = {
  title: string;
  updated: string;
  paragraphs: string[];
};

const LegalDocumentUi = ({ title, updated, paragraphs }: LegalDocumentUiProps) => {
  return (
    <>
      <h1 className='font-display text-4xl leading-tight font-semibold'>{title}</h1>
      <p className='mt-2 text-sm text-text-3'>{updated}</p>
      <div className='mt-8 space-y-5 text-lead leading-relaxed text-muted-foreground'>
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </>
  );
};

export default LegalDocumentUi;
