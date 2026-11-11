import { DayPanelUi, SectionWrapUi } from '../../components';
import { useDayContainer } from '../../hooks';

/** A day on Signet: the section pins and the scroll draws a line through six moments while the day's budget fills. */
const DayContainer = () => {
  const { t, track, isWide, total, now, line, spent, stoppedCount, moments } = useDayContainer();

  return (
    <section id='day' ref={track} className='relative z-[4]' style={{ height: `calc(100vh + ${total} * 70vh)` }}>
      <div className='sticky top-0 flex h-screen items-center'>
        <SectionWrapUi>
          <h2 className='font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>{t('day.heading')}</h2>
          <DayPanelUi moments={moments} now={now} line={line} spent={spent} stoppedCount={stoppedCount} isWide={isWide} />
        </SectionWrapUi>
      </div>
    </section>
  );
};

export default DayContainer;
