import { mockRequest } from '../mock-transport';

export const getDepositList = () => mockRequest((s) => s.deposits);
