const statistics = () => import('./views/Statistics.vue')
const users = () => import('./views/Users.vue')
const companies = () => import('./views/Companies.vue')
const contact = () => import('./views/Contact.vue')
const calls = () => import('./views/Calls.vue')
const rescheduled = () => import('./views/Rescheduled.vue')
const reports = () => import('./views/Reports.vue')
const surveys = () => import('./views/Surveys.vue')
import { useRoute } from 'vue-router';

const quotas = () => import('./views/Quotas.vue')

export const PrivateRoutes = [
    {
        path: '',
        redirect: '/statistics',
    },
    {
        path: '/statistics',
        component: statistics,
        name: 'statistics',
        meta: {
            title: 'statistics',
            menu: 'statistics',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/users',
        component: users,
        name: 'users',
        meta: {
            title: 'users',
            menu: 'users',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/companies',
        component: companies,
        name: 'companies',
        meta: {
            title: 'companies',
            menu: 'companies',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/contact/:companyId?',
        component: contact,
        name:'contact',
        meta: {
            title: 'contact',
            menu: 'contact',
            requiredRole: ['Contactador']
        }
    },    
    {
        path: '/quotas',
        component: quotas,
        name: 'quotas',
        meta: {
            title: 'quotas',
            menu: 'quotas',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/calls',
        component: calls,
        name: 'calls',
        meta: {
            title: 'calls',
            menu: 'calls',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/rescheduled',
        component: rescheduled,
        name: 'rescheduled',
        meta: {
            title: 'rescheduled',
            menu: 'rescheduled',
            requiredRole: ['Contactador']
        }
    },
    {
        path: '/reports',
        component: reports,
        name: 'reports',
        meta: {
            title: 'reports',
            menu: 'reports',
            requiredRole: ['Administrador']
        }
    },
    {
        path: '/surveys',
        component: surveys,
        name: 'surveys',
        meta: {
            title: 'surveys',
            menu: 'surveys',
            requiredRole: ['Administrador']
        }
    },
]