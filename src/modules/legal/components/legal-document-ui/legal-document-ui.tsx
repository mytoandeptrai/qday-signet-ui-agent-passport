type LegalDocumentUiProps = {
  title: string;
  updated: string;
  paragraphs: string[];
};

const LegalDocumentUi = ({ title, updated, paragraphs }: LegalDocumentUiProps) => {
  return (
    <>
      <h1 className='font-display text-[40px] leading-[1.15] font-semibold'>{title}</h1>
      <p className='mt-2 text-sm text-text-3'>{updated}</p>
      <div className='mt-8 space-y-5 text-[15px] leading-[1.7] text-muted-foreground'>
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </>
  );
};

export default LegalDocumentUi;
