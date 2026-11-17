import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/use-copy';
import { AGENT_INSTALLS } from '../../utils';

type GetStartedAgentUiProps = {
  text: string;
};

const InstallCommand = ({ name, command }: (typeof AGENT_INSTALLS)[number]) => {
  const [copied, copy] = useCopy();
  return (
    <div>
      <p className='mb-1 text-small text-muted-foreground'>{name}</p>
      <div className='relative rounded-md border bg-card p-4 pr-14'>
        <p className='font-mono text-small'>{command}</p>
        <Button variant='ghost' size='icon-sm' aria-label={`Copy ${name} install command`} onClick={() => copy(command)} className='absolute top-2.5 right-3 text-muted-foreground'>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
    </div>
  );
};

const GetStartedAgentUi = ({ text }: GetStartedAgentUiProps) => (
  <div className='max-w-3xl text-body text-muted-foreground'>
    <p>{text}</p>
    <div className='mt-4 flex flex-col gap-3'>
      {AGENT_INSTALLS.map((agent) => (
        <InstallCommand key={agent.name} {...agent} />
      ))}
    </div>
  </div>
);

export default GetStartedAgentUi;
