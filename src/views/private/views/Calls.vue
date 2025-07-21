<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <select v-model="selectedCompanyId" @change="getDataCallsByCompany"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-8 mt-8">
                <option value="" disabled selected>Seleccionar empresa</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">{{ company.name }}
                </option>
            </select>

            <div class="text-2xl font-semibold mb-4">Llamadas</div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'acciones'">
                        <button type="button"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            @click="openDeleteCallAlert(props.row)">
                            Eliminar
                        </button>
                    </span>
                    <span v-if="props.column.field == 'incidence'">
                        {{ props.row.incidence.description }}
                    </span>
                </template>
                <template v-slot:emptystate>
                    <div style="text-align: center">No hay datos disponibles</div>
                </template>
            </VueGoodTable>
        </div>
        <div v-if="showCallDeleteAlert" class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen">
                <div class="fixed inset-0 transition-opacity" @click="closeDeleteCallAlert" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 mb-4"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div class="flex items-center">
                        <h3 class="text-lg font-medium">¿Estás seguro que deseas eliminar llamada?
                        </h3>
                    </div>
                    <div class="mt-2 mb-4 text-sm">
                        Este elemento se eliminará permanentemente. Esta acción no se puede revertir.
                    </div>
                    <div class="flex">
                        <button @click="deleteCall(this.selectedCompanyId, this.callDeleted.id)" type="button"
                            class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                            Eliminar
                        </button>
                        <button @click="closeDeleteCallAlert()" type="button"
                            class="text-red-800 bg-transparent inline-flex items-center hover:bg-red-800 hover:text-white border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            data-dismiss-target="#alert-additional-content-2" aria-label="Close">
                            Cancelar
                        </button>
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
            selectedCompanyId: "",
            showCallDeleteAlert: false,
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
            columns: [
                {
                    label: "Teléfono",
                    field: "phone",
                },
                {
                    label: "Incidencia",
                    field: "incidence",
                },
                {
                    label: "Comentario",
                    field: "comment",
                },
                {
                    label: "Fecha",
                    field: "date",
                    type: "date",
                    dateInputFormat: "dd-MM-yyyy HH:mm:ss",
                    dateOutputFormat: "dd-MM-yyyy",
                },
                {
                    label: "Acciones",
                    field: "acciones",
                    type: "slots",
                },
            ],
            rows: [],
            companies: [],
            callDeleted: {
                id: "",
                phone: "",
                comment: "",
            }

        };
    },
    mounted() {
        this.getDataCompanies();
    },
    methods: {
        openDeleteCallAlert(item) {
            this.callDeleted = { ...item }
            this.showCallDeleteAlert = true;
        },
        closeDeleteCallAlert() {
            this.showCallDeleteAlert = false;
        },
        getDataCompanies() {
            GlobalService.getData(`/company/list-companies`)
                .then((response) => {
                    this.companies = response.companies
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getDataCallsByCompany() {
            GlobalService.getData(`/call/list-calls/${this.selectedCompanyId}`)
                .then((response) => {
                        this.rows = response.calls.map((call) => ({
                            id: call.id,
                            phone: call.phone,
                            comment: call.comment,
                            date: dayjs(call.date).format("DD-MM-YYYY HH:mm:ss"),
                            incidence: call.incident
                        }));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        deleteCall(companyId, callId) {
            GlobalService.deleteDataById2("/call/delete-call", companyId, callId)
                .then((response) => {
                    this.toast.success(response.msg);
                    this.rows = response.calls.map((call) => ({
                        id: call.id,
                        phone: call.phone,
                        comment: call.comment,
                        date: dayjs(call.date).format("DD-MM-YYYY HH:mm:ss"),
                        incidence: call.incident
                    }));
                    this.closeDeleteCallAlert()
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
        }
    },
};
</script>

<style></style>