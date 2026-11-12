import { forSelectedPass, mockRequest } from '../mock-transport';

export const getActivityList = () => mockRequest((s) => forSelectedPass(s, s.activity));
