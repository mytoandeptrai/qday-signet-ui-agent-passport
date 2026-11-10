import { INSTALL_PROMPT } from '@/mock/landing';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function InstallButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () => {
    navigator.clipboard?.writeText(INSTALL_PROMPT).catch(() => undefined);
    toast.success('Install prompt copied. Paste it into your agent.');
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='group/inst relative flex w-[140px] max-md:w-full'>
      <button
        type='button'
        onClick={copy}
        aria-label='Install: copy the install prompt'
        className={cn(
          'inline-flex h-11 items-center justify-center overflow-hidden border border-input bg-white px-4 text-[15px] font-medium whitespace-nowrap transition-[width,background-color] duration-300 hover:bg-subtle',
          copied ? 'w-[250px] max-md:w-full text-[13px]' : 'w-[140px] max-md:w-full'
        )}
      >
        <span aria-live='polite'>{copied ? 'Copied. Paste it into your agent.' : 'Install'}</span>
      </button>
      <div
        role='note'
        className={cn(
          'pointer-events-none invisible absolute top-[calc(100%+10px)] left-1/2 z-10 w-[440px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1 cursor-pointer rounded-md border bg-white px-4 pt-3.5 pb-3 text-left opacity-0 shadow-[0_8px_32px_rgba(27,26,23,.08)] transition-all duration-200 group-focus-within/inst:visible group-focus-within/inst:translate-y-0 group-focus-within/inst:opacity-100 group-hover/inst:pointer-events-auto group-hover/inst:visible group-hover/inst:translate-y-0 group-hover/inst:opacity-100 max-md:left-0 max-md:w-auto max-md:translate-x-0',
          copied && '!invisible !opacity-0'
        )}
        onClick={copy}
      >
        <p className='text-[13px] leading-[1.55]'>
          Install Signet: run <code className='rounded-sm bg-subtle px-1 font-mono text-[12.5px] break-all'>curl -fsSL https://signet.example/install.sh | bash</code>. It adds the signet command and the Signet skills, and you can read the script first. When it finishes, tell me in plain words what it printed.
        </p>
        <p className='mt-2.5 flex justify-between gap-3 border-t pt-2 text-xs text-text-3'>
          <span>Paste into Claude Code or Codex</span>
          <b className='font-medium text-muted-foreground'>Click to copy</b>
        </p>
      </div>
    </div>
  );
}
