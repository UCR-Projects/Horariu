interface IBaseCourse {
  courseName: string;
  day: string;
  startTime: string;
  endTime: string;
  groupNumber: number;
  courseDetails?: {
    professor?: string;
    courseCode?: string;
    classroom?: string;
    building?: string;
  };
}

export interface IAddCourseData extends IBaseCourse {
  userId: string;
}

export interface ICourseData extends IBaseCourse {
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type ICourseIdentifiers = Pick<IAddCourseData, 'userId' | 'courseName' | 'day' | 'startTime' | 'groupNumber'>
