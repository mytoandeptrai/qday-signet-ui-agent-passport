import { useState } from 'react';
import { ALLOWANCE_STEP_INDEX, GET_STARTED_STEPS } from '../utils';

/** Page-level state shared by the Get started stepper and the allowance meter. */
export const useOverviewContainer = () => {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);

  const onSelectStep = (index: number) => setStep(index);
  const onToggleOpen = () => setOpen((o) => !o);
  const onEditAllowance = () => {
    setStep(ALLOWANCE_STEP_INDEX);
    setOpen(true);
  };

  return { step, stepId: GET_STARTED_STEPS[step], open, onSelectStep, onToggleOpen, onEditAllowance };
};
