import { mockRequest } from '../mock-transport';

export const getActivityList = () => mockRequest((s) => s.activity);
