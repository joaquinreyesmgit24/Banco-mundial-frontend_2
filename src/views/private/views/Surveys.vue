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
                        label: "Q_S10",
                        field: "Q_S10",
                    },
                    {
                        label: "Q_S8",
                        field: "Q_S8",
                    },
                    {
                        label: "Q_S9",
                        field: "Q_S9",
                    },
                    {
                        label: "Q_S4",
                        field: "Q_S4",
                    },
                    {
                        label: "Q_S7",
                        field: "Q_S7",
                    },
                    {
                        label: "Q_A7",
                        field: "Q_A7",
                    },
                    {
                        label: "Q_A7A",
                        field: "Q_A7A",
                    },
                    {
                        label: "Q_A7B",
                        field: "Q_A7B",
                    },
                    {
                        label: "Q_A11",
                        field: "Q_A11",
                    },
                    {
                        label: "Q_A7C",
                        field: "Q_A7C",
                    },
                    {
                        label: "Q_A7D_address",
                        field: "Q_A7D_address",
                    },
                    {
                        label: "Q_A7D_estab_name",
                        field: "Q_A7D_estab_name",
                    },
                    {
                        label: "Q_A9",
                        field: "Q_A9",
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
                GlobalService.getData("/survey/list-surveys")
                    .then((response) => {
                        this.rows = response.surveys.map((survey) => ({
                        id: survey.id,
                        Q_S10:survey.Q_S10,
                        Q_S8:survey.Q_S8,
                        Q_S9:survey.Q_S9,
                        Q_S4:survey.Q_S4,
                        Q_S7:survey.Q_S7,
                        Q_A7:survey.Q_A7,
                        Q_A7A:survey.Q_A7A,
                        Q_A7B:survey.Q_A7B,
                        Q_A11:survey.Q_A11,
                        Q_A7C:survey.Q_A7C,
                        Q_A7D_address:survey.Q_A7D_address,
                        Q_A7D_estab_name:survey.Q_A7D_estab_name,
                        Q_A9:survey.Q_A9,
                        status:survey.status,
                        fecha:dayjs(survey.createdAt).format("DD-MM-YYYY HH:mm:ss"),
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