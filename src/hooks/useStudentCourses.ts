'use client';

import { useEffect, useState } from 'react';
import { isValidStudentCourseBundle, type CourseId } from '@/lib/student-courses';

export function useStudentCourses() {
  const [courses, setCourses] = useState<CourseId[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCourses = async () => {
      try {
        const response = await fetch('/api/student/courses');
        const result: unknown = await response.json();
        if (!response.ok) {
          const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
            ? result.error
            : 'Unable to load course access.';
          throw new Error(message);
        }

        if (!result || typeof result !== 'object' || !('courses' in result)) {
          throw new Error('The course access response was invalid.');
        }

        const allowedCourses: unknown = result.courses;
        if (!isValidStudentCourseBundle(allowedCourses)) {
          throw new Error('Your course bundle is invalid. Contact an administrator.');
        }

        if (active) {
          setCourses(allowedCourses);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          setCourses(null);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load course access.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadCourses();
    return () => { active = false; };
  }, []);

  return { courses, error, isLoading };
}
