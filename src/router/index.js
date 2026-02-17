import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Auth routes
  {
    path: '/login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },

  // Student routes
  {
    path: '/student',
    component: () => import('@/views/student/StudentDashboard.vue'),
    meta: { role: 'student' },
  },
  {
    path: '/student/schedule',
    component: () => import('@/views/student/ScheduleAppointment.vue'),
    meta: { role: 'student' },
  },
  {
    path: '/student/appointments',
    component: () => import('@/views/student/MyAppointments.vue'),
    meta: { role: 'student' },
  },
  {
    path: '/student/profile',
    component: () => import('@/views/student/MyProfile.vue'),
    meta: { role: 'student' },
  },
  

  // Psychologist routes
  {
    path: '/psychologist',
    component: () => import('@/views/psychologist/PsychologistDashboard.vue'),
    meta: { role: 'psychologist' },
  },
  {
    path: '/psychologist/schedule',
    component: () => import('@/views/psychologist/MySchedule.vue'),
    meta: { role: 'psychologist' },
  },
  {
    path: '/psychologist/records',
    component: () => import('@/views/psychologist/RecordsList.vue'),
    meta: { role: 'psychologist' },
  },
  {
    path: '/psychologist/records/:id',
    component: () => import('@/views/psychologist/RecordDetail.vue'),
    meta: { role: 'psychologist' },
  },
  {
    path: '/psychologist/records/:id/note',
    component: () => import('@/views/psychologist/NewClinicalNote.vue'),
    meta: { role: 'psychologist' },
  },
  {
    path: '/psychologist/profile',
    component: () => import('@/views/psychologist/MyProfile.vue'),
    meta: { role: 'psychologist' },
  },

  // Admin routes
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/users',
    component: () => import('@/views/admin/UserManagement.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/create-psychologist',
    component: () => import('@/views/admin/CreatePsychologist.vue'),
    meta: { role: 'admin' },
  },
  {
    path: '/admin/profile',
    component: () => import('@/views/admin/MyProfile.vue'),
    meta: { role: 'admin' },
  },

  // Default redirect
  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // If route is for guests only and user is logged in
  if (to.meta.guest && auth.isAuthenticated) {
    const role = auth.user?.role
    return next(`/${role}`)
  }

  // If route requires auth and user is not logged in
  if (to.meta.role && !auth.isAuthenticated) {
    return next('/login')
  }

  // If route requires a specific role and user has a different role
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next(`/${auth.user?.role}`)
  }

  next()
})

export default router