import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { FormNumberInput } from '@/components/form-fields/form-number-input';

afterEach(cleanup);

const Harness = () => {
  const form = useForm<{ amount?: number }>({ defaultValues: { amount: 20 } });
  return (
    <FormProvider {...form}>
      <FormNumberInput control={form.control} name='amount' label='Amount' />
    </FormProvider>
  );
};

it('lets a number input be cleared', () => {
  render(<Harness />);
  const input = screen.getByLabelText('Amount') as HTMLInputElement;
  expect(input.value).toBe('20');
  fireEvent.change(input, { target: { value: '' } });
  expect(input.value).toBe('');
});
