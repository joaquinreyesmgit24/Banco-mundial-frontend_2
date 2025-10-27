<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between items-center mb-4">
                <div class="text-xl font-semibold">Usuarios</div>
                <button type="button"
                    class="text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto"
                    data-bs-toggle="modal" data-bs-target="#modalCreateUser" @click="openCreateUserModal()">
                    Agregar
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm text-left text-gray-900 border border-gray-200">
                    <thead class="text-xs uppercase bg-violet-700 text-gray-300">
                        <tr>
                            <th class="px-6 py-3">Nombre de usuario</th>
                            <th class="px-6 py-3">Rol</th>
                            <th class="px-6 py-3">Fecha de creación</th>
                            <th class="px-6 py-3">Estado</th>
                            <th class="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.id" class="bg-white border-b hover:bg-gray-50">
                            <td class="px-6 py-3">{{ row.username }}</td>
                            <td class="px-6 py-3">{{ row.role.name }}</td>
                            <td class="px-6 py-3">{{ row.date }}</td>
                            <td class="px-6 py-3">{{ row.status }}</td>
                            <td class="px-6 py-3">
                                <button type="button"
                            class="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3"
                            data-bs-toggle="modal" data-bs-target="#modalUpdateUser"
                            @click="openUpdateUserModal(row)">
                            Editar
                        </button>
                        <button type="button"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            @click="openDeleteUserAlert(row)">
                            Eliminar
                        </button>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Paginación -->
            <div class="flex justify-between items-center mt-4 space-x-2">
                <button 
                    @click="changePage(1)" 
                    :disabled="currentPage === 1" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none disabled:bg-gray-300"
                >
                    Primera
                </button>

                <button 
                    @click="changePage(currentPage - 1)" 
                    :disabled="currentPage <= 1" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none disabled:bg-gray-300"
                >
                    Anterior
                </button>

                <span class="text-gray-700 dark:text-gray-300">
                    Página {{ currentPage }} de {{ totalPages }}
                </span>

                <button 
                    @click="changePage(currentPage + 1)" 
                    :disabled="currentPage >= totalPages" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none disabled:bg-gray-300"
                >
                    Siguiente
                </button>

                <button 
                    @click="changePage(totalPages)" 
                    :disabled="currentPage === totalPages || totalPages==0" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none disabled:bg-gray-300"
                >
                    Última
                </button>
            </div>
            <div v-if="showUserDeleteAlert" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeDeleteUserAlert" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 mb-4"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="flex items-center">
                            <h3 class="text-lg font-medium">¿Estás seguro que deseas eliminar al usuario {{userDeleted.username}}?</h3>
                        </div>
                        <div class="mt-2 mb-4 text-sm">
                            Este elemento se eliminará permanentemente. Esta acción no se puede revertir.
                        </div>
                        <div class="flex">
                            <button @click="deleteUser(this.userDeleted.id)" type="button"
                                class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                                Eliminar
                            </button>
                            <button @click="closeDeleteUserAlert()" type="button"
                                class="text-red-800 bg-transparent inline-flex items-center hover:bg-red-800 hover:text-white border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                data-dismiss-target="#alert-additional-content-2" aria-label="Close">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showUserUpdateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeUpdateUserModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeUpdateUserModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="updateUser(editedUser.id, editedUser)" class="p-4 md:p-5">
                            <div class="grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        usuario:</label>
                                    <input type="text" name="username" id="username"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de usuario" v-model.trim="editedUser.username" />
                                    </div>
                                    <div class="col-span-2">
                                        <label for="img" class="block mb-2 text-sm font-medium text-gray-900">Selecciona una imagen:</label>
                                        <input  @change="updatehandleFileChange" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500" id="img" type="file">
                                    </div>    
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="role"
                                        class="block mb-2 text-sm font-medium text-gray-900">Rol:</label>
                                    <select id="role"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="editedUser.roleId">
                                        <option value="" disabled selected>
                                            Seleccionar rol
                                        </option>
                                        <option v-for="role in roles" :key="role.id" :value="role.id">
                                            {{ role.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="password"
                                        class="block mb-2 text-sm font-medium text-gray-900">Contraseña:</label>
                                    <input type="password" name="password" id="password"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model.trim="editedUser.password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="repeatPassword" class="block mb-2 text-sm font-medium text-gray-900">Repetir
                                        contraseña:</label>
                                    <input type="password" name="repeatPassword" id="repeatPassword"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model.trim="editedUser.repeat_password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="status"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado</label>
                                    <input type="checkbox" id="status" v-model="editedUser.status" />
                                </div>
                            </div>
                            <button type="submit"
                                class="text-white inline-flex items-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Editar usuario
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div v-if="showUserCreateModal" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeCreateUserModal" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <button @click="closeCreateUserModal"
                            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <form @submit.prevent="createUser(createdUser)" class="p-4 md:p-5">
                            <div class="grid gap-2 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Nombre de
                                        usuario:</label>
                                    <input type="text" name="username" id="username"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Nombre de usuario" v-model.trim="createdUser.username" />
                                </div>
                                <div class="col-span-2">
                                    <label for="img" class="block mb-2 text-sm font-medium text-gray-900">Selecciona una imagen:</label>
                                    <input  @change="createhandleFileChange" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500" id="img" type="file">
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="role"
                                        class="block mb-2 text-sm font-medium text-gray-900">Rol:</label>
                                    <select id="role"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        v-model="createdUser.roleId">
                                        <option value="" disabled selected>
                                            Seleccionar rol
                                        </option>
                                        <option v-for="role in roles" :key="role.id" :value="role.id">
                                            {{ role.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="password"
                                        class="block mb-2 text-sm font-medium text-gray-900">Contraseña:</label>
                                    <input type="password" name="password" id="password"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model.trim="createdUser.password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="repeatPassword" class="block mb-2 text-sm font-medium text-gray-900">Repetir
                                        contraseña:</label>
                                    <input type="password" name="repeatPassword" id="repeatPassword"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                                        placeholder="Contraseña" v-model.trim="createdUser.repeat_password" />
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label for="status"
                                        class="block mb-4 text-sm font-medium text-gray-900">Estado (Activo - No Activo)</label>
                                        <input type="checkbox" id="status" v-model="createdUser.status"/>
                                </div>
                            </div>
                            <button type="submit"
                                class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Crear usuario
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import { VueGoodTable } from "vue-good-table-next";
    import "vue-good-table-next/dist/vue-good-table-next.css";
    import { useToast } from "vue-toastification";
    import dayjs from "dayjs"; // Importa dayjs
    export default {
        name: "list-users",
        components: {
            VueGoodTable,
        },
        data() {
            return {
                showUserUpdateModal: false,
                showUserCreateModal: false,
                showUserDeleteAlert: false,
                searchOptions: {
                    enabled: true,
                    placeholder: "Buscar",
                },
                paginationOptions: {
                    enabled: true,
                    perPage: 5,
                    nextLabel: "Siguiente",
                    prevLabel: "Anterior",
                    rowsPerPageLabel: "Filas por página",
                    paginationComplete: false,
                    ofLabel: "de",
                    allLabel: 'Todo',
                },
                toast: useToast(),
                rows: [],
                currentPage: 1,
                totalUsers: 0,
                perPage: 5,
                roles: [],
                editedUser: {
                    id:"",
                    username: "",
                    password: "",
                    repeat_password: "",
                    roleId: "",
                    file:null,
                    status: "",
                },
                createdUser: {
                    username: "",
                    password: "",
                    repeat_password: "",
                    roleId: "",
                    file:null,
                    status: false,
                },
                userDeleted:{
                    id:"",
                    username: "",
                    password: "",
                    repeat_password: "",
                    roleId: "",
                    status: "",
                }
                
            };
        },
        mounted() {
            this.getDataUsers();
            this.getDataRoles();
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalUsers / this.perPage);
            }
        },
        methods: {
            updatehandleFileChange(event){
                this.editedUser.file = event.target.files[0];

            },
            createhandleFileChange(event) {
                this.createdUser.file = event.target.files[0];
            },      
            openUpdateUserModal(item) {
                this.editedUser = { ...item, roleId: item.role.id,file:'', password: '', repeat_password: '' };
                this.showUserUpdateModal = true;
                if (item.status === "Activo") {
                    this.editedUser.status = true;
                } else {
                    this.editedUser.status = false;
                }
            },
            openCreateUserModal() {
                this.showUserCreateModal = true;
            },
            closeUpdateUserModal() {
                this.showUserUpdateModal = false;
            },
            closeCreateUserModal() {
                this.showUserCreateModal = false;
            },
            openDeleteUserAlert(item){
                this.userDeleted={...item}
                this.showUserDeleteAlert = true;
            },
            closeDeleteUserAlert(){
                this.showUserDeleteAlert = false;
            },
            getDataUsers() {
                GlobalService.getData(`/auth/list-users?page=${this.currentPage}&perPage=${this.perPage}`)
                    .then((response) => {
                        this.rows = response.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                        this.totalUsers = response.pagination.totalUsers;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getDataRoles() {
                GlobalService.getData("/auth/list-roles")
                    .then((response) => {
                        this.roles = response.roles
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            createUser(createdUser) {
                const formData = new FormData();
                formData.append('username', createdUser.username)
                formData.append('password', createdUser.password)
                formData.append('repeat_password', createdUser.repeat_password)
                formData.append('roleId', createdUser.roleId)
                formData.append('status', createdUser.status)
                if (createdUser.file) {
                    formData.append('file', createdUser.file);
                }
                GlobalService.createDataImage(`/auth/create-user?page=${this.currentPage}&perPage=${this.perPage}`, formData)
                    .then((response) => {
                        this.toast.success(response.data.msg);
                        this.rows = response.data.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                        this.totalUsers = response.data.pagination.totalUsers;
                        this.closeCreateUserModal()
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        console.log(errors)
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            },
            updateUser(userId, editedUser) {
                const formData = new FormData();
                formData.append('username', editedUser.username)
                formData.append('password', editedUser.password)
                formData.append('repeat_password', editedUser.repeat_password)
                formData.append('roleId', editedUser.roleId)
                formData.append('status', editedUser.status)
                if(editedUser.file){
                    formData.append('file', editedUser.file);
                }
                GlobalService.setDataImage(`/auth/update-user`, userId,`?page=${this.currentPage}&perPage=${this.perPage}`, formData)
                    .then((response) => {
                        this.toast.success(response.msg);
                        this.rows = response.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                        this.totalUsers = response.pagination.totalUsers;
                        this.closeUpdateUserModal()
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            },
            deleteUser(userId) {
                GlobalService.deleteDataById(`/auth/delete-user`,userId, `?page=${this.currentPage}&perPage=${this.perPage}`)
                    .then((response) => {
                        this.toast.success(response.msg);
                        if (response.users.length === 0 && this.currentPage > 1) {
                            this.currentPage--;
                            // Volvemos a cargar los datos con la nueva página
                            this.getDataUsers();
                            this.closeDeleteUserAlert()
                            return;
                        }

                        this.rows = response.users.map((user) => ({
                            id: user.id,
                            username: user.username,
                            role: user.role,
                            date: dayjs(user.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            status: user.status ? "Activo" : "Inactivo",
                        }));
                        this.totalUsers = response.pagination.totalUsers;
                        this.closeDeleteUserAlert()
                    })
                    .catch((e) => {
                        let errors = e.response.data.errors;
                        let error = e.response.data.error;
                        if (errors) {
                            errors.forEach((error_element) => {
                                this.toast.error(error_element.msg);
                            });
                        } else {
                            this.toast.error(error);
                        }
                    });
            },
            changePage(page) {
                if (page < 1 || page > this.totalPages) return;
                this.currentPage = page;
                this.getDataUsers();
        },
        },
    };
</script>

<style>
table {
    width: 100%;
    border-collapse: collapse; /* Asegura que las celdas no tengan bordes adicionales */
}

th, td {
    overflow: hidden;
    text-overflow: ellipsis;
    height: 65px !important;
}

.first-letter-uppercase::first-letter {
    text-transform: uppercase;
}
</style>