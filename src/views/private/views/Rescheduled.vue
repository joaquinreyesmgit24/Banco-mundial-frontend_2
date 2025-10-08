<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="text-2xl font-semibold mb-4">Reprogramaciones</div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'acciones'">
                        <button type="button"
                            class="mt-5 px-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-3.5 mb-6 text-center mr-2"
                            @click="goToContact(props.row.company.id)">
                            Contactar
                        </button>
                        <button type="button"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            @click="openDeleteRescheduledAlert(props.row)">
                            Eliminar
                        </button>
                    </span>
                    <span v-if="props.column.field == 'call'">
                        {{ props.row.call.phone }}
                    </span>
                    <span v-if="props.column.field == 'company'">
                        {{ props.row.company.name }}
                    </span>
                </template>
                <template v-slot:emptystate>
                    <div style="text-align: center">No hay datos disponibles</div>
                </template>
            </VueGoodTable>
            <div v-if="showRescheduledDeleteAlert" class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen">
                    <div class="fixed inset-0 transition-opacity" @click="closeDeleteRescheduledAlert" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 mb-4"
                        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="flex items-center">
                            <h3 class="text-lg font-medium">¿Estás seguro que deseas eliminar esta reprogramación?
                            </h3>
                        </div>
                        <div class="mt-2 mb-4 text-sm">
                            Este elemento se eliminará permanentemente. Esta acción no se puede revertir.
                        </div>
                        <div class="flex">
                            <button @click="deleteRescheduled(this.rescheduledDeleted.id)" type="button"
                                class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
                                Eliminar
                            </button>
                            <button @click="closeDeleteRescheduledAlert()" type="button"
                                class="text-red-800 bg-transparent inline-flex items-center hover:bg-red-800 hover:text-white border border-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                data-dismiss-target="#alert-additional-content-2" aria-label="Close">
                                Cancelar
                            </button>
                        </div>
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
import { mapActions, mapGetters } from "vuex";
export default {
    name: "list-users",
    components: {
        VueGoodTable,
    },
    data() {
        return {
            showRescheduledDeleteAlert: false,
            rows:[],
            toast: useToast(),
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
            rescheduledDeleted:{
                id:"",
                date:"",
                time:""
            },
            columns: [
                {
                    label: "Teléfono",
                    field: "call",
                },
                {
                    label: "Nombre de la empresa",
                    field: "company",
                },
                {
                    label: "Fecha",
                    field: "date",
                    type: "date",
                    dateInputFormat: "dd-MM-yyyy HH:mm:ss",
                    dateOutputFormat: "dd-MM-yyyy",
                },
                {
                    label: "Hora",
                    field: "time",
                    type: "time",
                },
                {
                    label: "Acciones",
                    field: "acciones",
                    type: "slots",
                },
            ],
        }
    },
    mounted(){
        this.getDataRescheduledByUser(this.getUserID)
    },
    methods: {
        getDataRescheduledByUser(userId) {
                GlobalService.getData(`/call/list-rescheduled-by-user/${userId}`)
                    .then((response) => {
                        this.rows = response.rescheduleds.map((rescheduled) => ({
                            id: rescheduled.id,
                            date:  dayjs(rescheduled.date).format("DD-MM-YYYY HH:mm:ss"),
                            time: rescheduled.time,
                            call: rescheduled.call,
                            company: rescheduled.call.company
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        openDeleteRescheduledAlert(item) {
            this.rescheduledDeleted = { ...item }
            this.showRescheduledDeleteAlert = true;
        },
        closeDeleteRescheduledAlert() {
            this.showRescheduledDeleteAlert = false;
        },
        deleteRescheduled(rescheduledId) {
            GlobalService.deleteDataById2("/call/delete-rescheduled", rescheduledId, this.getUserID)
                .then((response) => {
                    this.toast.success(response.msg);
                    this.rows = response.rescheduleds.map((rescheduled) => ({
                            id: rescheduled.id,
                            date:  dayjs(rescheduled.date).format("DD-MM-YYYY HH:mm:ss"),
                            time: rescheduled.time,
                            call: rescheduled.call,
                            company: rescheduled.call.company
                    }));
                    this.closeDeleteRescheduledAlert()
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
        goToContact(companyId) {
            this.$router.push({ name: 'contact', params: { companyId: companyId} });
        }
    },
    computed: {
        ...mapGetters(["getUserID"]),
    }
};
</script>

<style></style>