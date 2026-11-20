export interface InstitutionViewer {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface InstitutionBranch {
  id: string;
  name: string;
  code: string;
  city: string | null;
  address: string | null;
}

export interface InstitutionDetails {
  id: string;
  name: string;
  code: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
  headUserId: string | null;
  branches: InstitutionBranch[];
}

export interface InstitutionBatch {
  id: string;
  name: string;
  grade: string | null;
  status: string;
  startDate: string;
  endDate: string;
  branchId: string;
  branchName: string;
  programmeName: string;
  programmeCode: string;
  teachers: string[];
  studentCount: number;
  attendanceRate: number | null;
  completionRate: number | null;
}

export type InstitutionPacingHealth = 'Stable' | 'Watch' | 'Intervention' | 'No attendance';
export type InstitutionStudentFlag = 'Active' | 'Warning' | 'Critical';

export interface InstitutionStudent {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string | null;
  accountStatus: string;
  batchId: string;
  batchName: string;
  grade: string | null;
  attendanceRate: number | null;
  attendancePresent: number;
  attendanceTotal: number;
  pacingHealth: InstitutionPacingHealth;
  flag: InstitutionStudentFlag;
}

export interface InstitutionLiveClass {
  id: string;
  title: string;
  meetUrl: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: string;
  isLive: boolean;
  batchId: string;
  batchName: string;
  subjectName: string;
  teacherName: string | null;
}

export interface InstitutionTeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  batchId: string;
  batchName: string;
  subjectName: string;
}

export interface InstitutionAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  studentId?: string;
  batchId?: string;
}

export interface InstitutionReportBatch {
  batchId: string;
  batchName: string;
  status: string;
  grade: string | null;
  programmeName: string;
  studentCount: number;
  classCount: number;
  attendanceRate: number | null;
  completionRate: number | null;
}

export interface InstitutionReportSummary {
  totalStudents: number;
  totalBatches: number;
  activeBatches: number;
  totalBranches: number;
  totalClasses: number;
  attendanceRate: number | null;
  attendancePresent: number;
  attendanceTotal: number;
  batches: InstitutionReportBatch[];
}

export interface InstitutionDashboardData {
  viewer: InstitutionViewer;
  institution: InstitutionDetails | null;
  batches: InstitutionBatch[];
  students: InstitutionStudent[];
  liveClasses: InstitutionLiveClass[];
  teacherAssignments: InstitutionTeacherAssignment[];
  reports: InstitutionReportSummary;
  alerts: InstitutionAlert[];
  generatedAt: string;
}

export function emptyReportSummary(): InstitutionReportSummary {
  return {
    totalStudents: 0,
    totalBatches: 0,
    activeBatches: 0,
    totalBranches: 0,
    totalClasses: 0,
    attendanceRate: null,
    attendancePresent: 0,
    attendanceTotal: 0,
    batches: [],
  };
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return 'IH';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'IH';
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatPercent(value: number | null | undefined): string {
  return value == null || Number.isNaN(value) ? '—' : `${Math.round(value)}%`;
}

export function attendanceColor(value: number | null | undefined): string {
  if (value == null) return '#888888';
  if (value >= 90) return '#4CAF50';
  if (value >= 75) return '#FF9800';
  return '#FF5252';
}

export function statusLabel(value: string | null | undefined): string {
  if (!value) return 'Unknown';
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join(' ');
}
