import { useState } from 'react';
import { GET_STARTED_STEPS } from '../utils';

/** Page-level state for the Get started stepper. */
export const useOverviewContainer = () => {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);

  const onSelectStep = (index: number) => setStep(index);
  const onToggleOpen = () => setOpen((o) => !o);

  return { step, stepId: GET_STARTED_STEPS[step], open, onSelectStep, onToggleOpen };
};
