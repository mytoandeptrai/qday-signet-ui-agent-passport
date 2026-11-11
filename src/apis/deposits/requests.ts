import { mockRequest } from '../mock-transport';
import type { CreateDepositParams } from './types';

export const getDepositList = () => mockRequest((s) => s.deposits);
export const createDeposit = ({ amount, method }: CreateDepositParams) => mockRequest((s) => s.deposit(amount, method));
