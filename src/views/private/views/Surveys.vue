<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="text-2xl font-semibold mb-4">Encuestas</div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px" :fixed-header="true">
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
                columns: [
                    {
                        label:"Id",
                        field: "id",
                    },
                    {
                        label: "Q_1",
                        field: "Q_1",
                    },
                    {
                        label: "Q_2",
                        field: "Q_2",
                    },
                    {
                        label: "Q_3",
                        field: "Q_3",
                    },
                    {
                        label: "Q_4",
                        field: "Q_4",
                        type: "date",
                        dateInputFormat: "dd-MM-yyyy",
                        dateOutputFormat: "dd-MM-yyyy",
                    },
                    {
                        label: "Q_5",
                        field: "Q_5",
                    },
                    {
                        label: "Q_6",
                        field: "Q_6",
                    },
                    {
                        label: "Q_7",
                        field: "Q_7",
                    },
                    {
                        label: "Fecha de creación",
                        field: "date",
                        type: "date",
                        dateInputFormat: "dd-MM-yyyy HH:mm:ss",
                        dateOutputFormat: "dd-MM-yyyy",
                    },
                    {
                        label: "status",
                        field: "status",
                    },
                ],
                rows: [],
                roles: [],
                
            };
        },
        mounted() {
            this.getDataSurveys();
        },
        methods: {
            getDataSurveys() {
                GlobalService.getData("/survey/list-survey")
                    .then((response) => {
                        console.log(response.surveys)
                        this.rows = response.surveys.map((survey) => ({
                        id: survey.id,
                        Q_1:survey.Q_1,
                        Q_2:survey.Q_2,
                        Q_3:survey.Q_3,
                        Q_4:dayjs(survey.Q_4).format("DD-MM-YYYY"),
                        Q_5:survey.Q_5,
                        Q_6:survey.Q_6,
                        Q_7:survey.Q_7,
                        status:survey.status,
                        date:dayjs(survey.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        },
    };
</script>

<style>
</style>