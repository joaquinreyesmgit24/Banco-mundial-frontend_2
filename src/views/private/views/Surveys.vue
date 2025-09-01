<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between items-center mb-4">
                <div class="text-2xl font-semibold mb-4">Encuestas</div>
                <button class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" @click="downloadSurveys">
                    Descargar Encuestas (Excel)
                </button>
            </div>
            <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions"
                :pagination-options="paginationOptions" max-height="450px">
                <template v-slot:table-row="props">
                    <span v-if="props.column.field == 'companyRut'">
                        {{ props.row.company.rut }}    
                    </span>
                    <span v-if="props.column.field == 'companyName'">
                        {{ props.row.company.name }}    
                    </span>
                    <span v-if="props.column.field == 'companyCode'">
                        {{ props.row.company.code }}    
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
import * as XLSX from "xlsx"; // Importa la librería de xlsx
    
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
                        label: "Q_8",
                        field: "Q_8",
                    },
                {
                        label: "Q_9",
                        field: "Q_9",
                    },
                    {
                        label: "Rut de la compañia",
                        field: "companyRut",
                    },
                    {
                        label: "Nombre de la compañia",
                        field: "companyName",
                    },
                    {
                        label: "Code de la compañia",
                        field: "companyCode",
                    },
                    {
                        label: "Fecha de creación",
                        field: "date",
                        type: "date",
                        dateInputFormat: "dd-MM-yyyy HH:mm:ss",
                        dateOutputFormat: "dd-MM-yyyy",
                    },
                    {
                        label: "Estado",
                        field: "status",
                    },
                    {
                        label: "Encuestador",
                        field: "username",
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
                        this.rows = response.surveys.map((survey) => ({
                            id: survey.id,
                            Q_1: survey.Q_1,
                            Q_2: survey.Q_2,
                            Q_3: survey.Q_3,
                            // Validar si la fecha es válida, si no es válida, dejarla vacía
                            Q_4: dayjs(survey.Q_4).isValid() ? dayjs(survey.Q_4).format("DD-MM-YYYY") : "", // Aquí se maneja el caso "Invalid Date"
                            Q_5: survey.Q_5,
                            Q_6: survey.Q_6,
                            Q_7: survey.Q_7,
                            Q_8: survey.Q_8,
                            Q_9: survey.Q_9,
                            company: survey.company,
                            companyName: survey.company.name,
                            status: survey.status,
                            date: dayjs(survey.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            username: survey.company.user.username,
                        }));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },

        downloadSurveys() {
            const headersMap = {
                Q_1: 'Q_1',
                Q_2: 'Q_2',
                Q_3: 'Q_3',
                Q_4: 'Q_4',
                Q_5: 'Q_5',
                Q_6: 'Q_6',
                Q_7: 'Q_7',
                Q_8: 'Q_8',
                Q_9: 'Q_9',
                companyName: 'Nombre de la Compañía',
                status: 'Estado',
                date: 'Fecha de creación',
                username: 'Encuestador',
            };
            const formattedRows = this.rows.map((row) => {
                const formattedRow = {};
                for (const key in row) {
                    // Omitimos el campo "company"
                    if (key !== 'company') {
                        if (headersMap[key]) {
                            formattedRow[headersMap[key]] = row[key]; // Asigna el valor con el nuevo nombre de campo
                        } else {
                            formattedRow[key] = row[key]; // Si no hay mapeo, conserva el nombre original
                        }
                    }
                }
                return formattedRow;
            });

            // Crea una nueva hoja de Excel con los encabezados modificados
            const ws = XLSX.utils.json_to_sheet(formattedRows);

            // Crea un libro de trabajo (workbook)
            const wb = XLSX.utils.book_new();

            // Agrega la hoja de Excel al libro de trabajo
            XLSX.utils.book_append_sheet(wb, ws, "Encuestas");

            // Descarga el archivo Excel
            XLSX.writeFile(wb, "Encuestas.xlsx");
},
        },
    };
</script>

<style>
</style>