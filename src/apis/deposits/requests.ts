import { forSelectedPass, mockRequest } from '../mock-transport';

export const getDepositList = () => mockRequest((s) => forSelectedPass(s, s.deposits));
