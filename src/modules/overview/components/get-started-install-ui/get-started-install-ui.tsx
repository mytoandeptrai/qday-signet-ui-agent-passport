import InstallCommand from '@/components/ui/install-command';

type GetStartedInstallUiProps = {
  text: string;
  prompt: string;
  windows: boolean;
  hasCode: boolean;
  canGetCode: boolean;
  isGettingCode: boolean;
  onGetCode: () => void;
  onCopy: () => void;
  onToggleWindows: () => void;
};

/** The same command as on SignetPass details, so the CLI steps need no trip to that page. */
const GetStartedInstallUi = ({ text, ...command }: GetStartedInstallUiProps) => (
  <div className='max-w-3xl text-body text-muted-foreground'>
    <p>{text}</p>
    <InstallCommand {...command} />
  </div>
);

export default GetStartedInstallUi;
