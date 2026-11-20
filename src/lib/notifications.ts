import type { UserRole } from '@/lib/rbac';

export type NotificationCategory = 'finance' | 'academic' | 'account' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: NotificationCategory;
  read: boolean;
  href?: string;
}

const COMMON_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'account-profile',
    title: 'Keep your profile up to date',
    message: 'Review your contact details so your institution can reach you with important updates.',
    time: 'Just now',
    category: 'account',
    read: false,
    href: '/dashboard/profile',
  },
  {
    id: 'system-security',
    title: 'Security reminder',
    message: 'Never share your academy password. Contact your administrator if you notice unusual activity.',
    time: '2 days ago',
    category: 'system',
    read: true,
  },
];

const ROLE_NOTIFICATIONS: Record<UserRole, AppNotification[]> = {
  admin: [
    {
      id: 'admin-users',
      title: 'New user invitations pending',
      message: '3 invited users have not activated their accounts yet.',
      time: '15 minutes ago',
      category: 'account',
      read: false,
      href: '/dashboard/admin/users',
    },
    {
      id: 'admin-security',
      title: 'Security audit completed',
      message: 'The latest platform security review finished without critical findings.',
      time: '1 hour ago',
      category: 'system',
      read: false,
      href: '/dashboard/admin/security',
    },
    {
      id: 'admin-finance',
      title: 'Finance correction awaiting approval',
      message: 'A ledger correction request needs an administrator decision.',
      time: '3 hours ago',
      category: 'finance',
      read: false,
      href: '/dashboard/admin/finance',
    },
  ],
  institution_head: [
    {
      id: 'institution-attendance',
      title: 'Attendance alert',
      message: 'Two students in Batch A have attendance below the 75% threshold.',
      time: '25 minutes ago',
      category: 'academic',
      read: false,
      href: '/dashboard/institution/alerts',
    },
    {
      id: 'institution-schedule',
      title: 'Teacher schedule updated',
      message: 'The schedule for Batch B changed for tomorrow afternoon.',
      time: '2 hours ago',
      category: 'academic',
      read: false,
      href: '/dashboard/institution/schedule',
    },
    {
      id: 'institution-report',
      title: 'Monthly report ready',
      message: 'The November institution performance report is available.',
      time: 'Yesterday',
      category: 'academic',
      read: true,
      href: '/dashboard/institution/reports',
    },
  ],
  teacher: [
    {
      id: 'teacher-grading',
      title: 'Submissions ready to grade',
      message: '5 new assignment submissions are waiting in your grading queue.',
      time: '10 minutes ago',
      category: 'academic',
      read: false,
      href: '/dashboard/teacher/grading',
    },
    {
      id: 'teacher-live',
      title: 'Live class starts soon',
      message: 'Batch 7A — Design begins in 30 minutes.',
      time: '30 minutes ago',
      category: 'academic',
      read: false,
      href: '/dashboard/teacher/live',
    },
    {
      id: 'teacher-progress',
      title: 'Student progress update',
      message: 'A student in Batch 8B needs additional support with CSS Grid.',
      time: '4 hours ago',
      category: 'academic',
      read: true,
      href: '/dashboard/teacher/progress',
    },
  ],
  student: [
    {
      id: 'student-assignment',
      title: 'Assignment due tomorrow',
      message: 'Your Colour Theory homework is due at 6:00 PM tomorrow.',
      time: '20 minutes ago',
      category: 'academic',
      read: false,
      href: '/dashboard/student/assignments',
    },
    {
      id: 'student-live',
      title: 'Live class reminder',
      message: 'Your next live class starts in 2 hours. Your 7-day streak is still active!',
      time: '1 hour ago',
      category: 'academic',
      read: false,
      href: '/dashboard/student/live',
    },
    {
      id: 'student-reward',
      title: 'New reward unlocked',
      message: 'You earned the "Creative Thinker" badge for completing week 6.',
      time: 'Yesterday',
      category: 'academic',
      read: true,
      href: '/dashboard/student/rewards',
    },
  ],
  money_management: [
    {
      id: 'finance-correction',
      title: 'Correction request pending',
      message: 'A refund transaction is awaiting audit approval before it can be corrected.',
      time: '12 minutes ago',
      category: 'finance',
      read: false,
      href: '/dashboard/admin/finance',
    },
    {
      id: 'finance-daily',
      title: 'Daily cashbook summary',
      message: 'Today’s income and expense entries have been reconciled successfully.',
      time: '2 hours ago',
      category: 'finance',
      read: false,
      href: '/dashboard/admin/finance',
    },
    {
      id: 'finance-audit',
      title: 'Ledger audit trail updated',
      message: 'New finance activity was recorded in the system audit log.',
      time: 'Yesterday',
      category: 'system',
      read: true,
      href: '/dashboard/admin/security',
    },
  ],
};

export function getNotificationsForRole(role: string | null | undefined): AppNotification[] {
  const roleNotifications =
    role && role in ROLE_NOTIFICATIONS
      ? ROLE_NOTIFICATIONS[role as UserRole]
      : ROLE_NOTIFICATIONS.student;

  return [...roleNotifications, ...COMMON_NOTIFICATIONS];
}
