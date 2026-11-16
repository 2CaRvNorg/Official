export const COURSE_CATALOG = [
  { id: 'communication', name: 'Communication', code: 'COMM-101', mandatory: true },
  { id: 'design', name: 'Design', code: 'DSG-101', mandatory: false },
  { id: 'tech', name: 'Tech', code: 'TECH-101', mandatory: false },
] as const;

export type CourseId = (typeof COURSE_CATALOG)[number]['id'];
export type ElectiveCourse = Extract<CourseId, 'design' | 'tech'>;

export function isCourseId(value: unknown): value is CourseId {
  return COURSE_CATALOG.some(course => course.id === value);
}

export function isElectiveCourse(value: unknown): value is ElectiveCourse {
  return value === 'design' || value === 'tech';
}

export function isValidStudentCourseBundle(value: unknown): value is CourseId[] {
  if (!Array.isArray(value) || value.length !== 2 || !value.every(isCourseId)) {
    return false;
  }

  return value.includes('communication') && value.includes('design') !== value.includes('tech');
}

export function getStudentCourseBundle(elective: ElectiveCourse): CourseId[] {
  return ['communication', elective];
}
