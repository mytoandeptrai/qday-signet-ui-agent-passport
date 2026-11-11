import { AnimationContainer } from '@/components/containers';
import { cn } from '@/lib/utils';
import SectionWrapUi from '../section-wrap-ui';
import TextLinkUi from '../text-link-ui';

type LineSectionUiProps = {
  id: string;
  text: string;
  align?: 'left' | 'right';
  link: { label: string; to?: string; href?: string };
};

const LineSectionUi = ({ id, text, align = 'left', link }: LineSectionUiProps) => {
  return (
    <section id={id} className='relative z-[4] py-10 md:py-12'>
      <SectionWrapUi>
        <AnimationContainer
          className={cn('flex flex-col', align === 'right' ? 'max-md:items-start md:items-end md:text-right' : 'items-start')}
        >
          <p className='max-w-[720px] font-display text-2xl leading-[1.35] font-semibold text-balance text-muted-foreground'>{text}</p>
          <TextLinkUi to={link.to} href={link.href}>
            {link.label}
          </TextLinkUi>
        </AnimationContainer>
      </SectionWrapUi>
    </section>
  );
};

export default LineSectionUi;
