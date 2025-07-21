<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="text-2xl font-semibold mb-4">Reprogramaciones</div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'acciones'">
                        <button type="button"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            @click="goToContact(props.row.company.id)">
                            Contactar
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