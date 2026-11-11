type PartnersUiProps = {
  partners: string[];
};

const PartnersUi = ({ partners }: PartnersUiProps) => {
  return (
    <ul className='flex flex-wrap gap-x-10 gap-y-4 text-[17px] text-[#9ea3ad]'>
      {partners.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
};

export default PartnersUi;
