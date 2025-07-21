<template>
    <div class="fixed left-0 top-0 w-64 h-full bg-violet-700 p-4 z-50 sidebar-menu transition-transform">
        <a href="#" class="flex items-center pb-4 border-b border-b-gray-800">
            <span class="text-lg font-bold text-white ml-3">Menú</span>
        </a>
        <ul class="mt-4">
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/users" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-user-line mr-3"></i>
                    <span class="text-sm">Usuarios</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/companies" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-building-line mr-3"></i>
                    <span class="text-sm">Empresas</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Contactador'">
                <router-link to="/contact" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-phone-fill mr-3"></i>
                    <span class="text-sm">Contactar</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/calls" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-headphone-line mr-3"></i>
                    <span class="text-sm">Llamadas</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/reports" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-file-3-line mr-3"></i>
                    <span class="text-sm">Reportes</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/surveys" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-draft-line mr-3"></i>
                    <span class="text-sm">Encuestas</span>
                </router-link>
            </li>
            <li class="mb-1" v-if="userRol=='Contactador'">
                <router-link to="/rescheduled" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-calendar-schedule-fill mr-3"></i>
                    <span class="text-sm">Reprogramaciones</span>
                </router-link>
            </li>
            <!-- <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/contact" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-file-list-line mr-3"></i>
                    <span class="text-sm">Agendas</span>
                </router-link>
            </li> -->
            <!-- <li class="mb-1" v-if="userRol=='Administrador'">
                <router-link to="/quotas" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-order-play-line mr-3"></i>
                    <span class="text-sm">Cuotas</span>
                </router-link>
            </li> -->
            <!-- <li class="mb-1">
                <router-link to="/reports" class="flex items-center py-2 px-4 text-gray-300 hover:bg-violet-950 hover:text-gray-100 rounded-md">
                    <i class="ri-phone-fill mr-3"></i>
                    <span class="text-sm">Llamadas</span>
                </router-link>
            </li> -->
        </ul>
    </div>
    <div class="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay"></div>
</template>

<script>
export default {
    name:"sidebar",
    props: {
        userRol: { type: String, default: 'No posee permisos' },
    },
}
</script>

<style>

</style>