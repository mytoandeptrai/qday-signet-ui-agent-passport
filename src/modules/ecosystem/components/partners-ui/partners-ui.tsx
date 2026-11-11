type PartnersUiProps = {
  partners: string[];
};

const PartnersUi = ({ partners }: PartnersUiProps) => {
  return (
    <ul className='flex flex-wrap gap-x-10 gap-y-4 text-lg text-text-3'>
      {partners.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
};

export default PartnersUi;
