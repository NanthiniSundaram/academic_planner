export interface User {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  preferences: { [key: string]: unknown };
} 