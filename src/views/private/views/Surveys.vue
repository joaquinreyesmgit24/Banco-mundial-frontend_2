<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between items-center mb-4">
                <div class="text-xl font-semibold mb-4">Encuestas</div>
                <button class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" @click="downloadSurveys">
                    Descargar Encuestas (Excel)
                </button>
            </div>
                         <!-- Tabla -->
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th class="px-6 py-3">Id</th>
                            <th class="px-6 py-3">Rut de la empresa</th>
                            <th class="px-6 py-3">Nombre de la empresa</th>
                            <th class="px-6 py-3">Código de la empresa</th>
                            <th class="px-6 py-3">Nombre del entrevistado</th>
                            <th class="px-6 py-3">Cargo del entrevistado</th>
                            <th class="px-6 py-3">Correo del entrevistado</th>
                            <th class="px-6 py-3">Celular del entrevistado</th>
                            <th class="px-6 py-3">Fecha de agenda</th>
                            <th class="px-6 py-3">Hora de agenda</th>
                            <th class="px-6 py-3">Encuestador</th>
                            <th class="px-6 py-3">Estado</th>
                            <th class="px-6 py-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 lowercase">
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.id }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.companyRut }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.companyName }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.companyCode }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.q_6 }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.q_7 }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.q_8 }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.q_9 }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.q_4 }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.q_5 }}</td>
                            <td class="px-6 py-3 first-letter-uppercase">{{ row.username }}</td>
                            <td class="px-6 py-3">{{ row.status }}</td>
                            <td class="px-6 py-3">{{ row.date }}</td>
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
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none disabled:bg-gray-300"
                >
                    Anterior
                </button>

                <span class="text-gray-700 dark:text-gray-300">
                    Página {{ currentPage }} de {{ totalPages }}
                </span>

                <button 
                    @click="changePage(currentPage + 1)" 
                    :disabled="currentPage >= totalPages" 
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none disabled:bg-gray-300"
                >
                    Siguiente
                </button>

                <button 
                    @click="changePage(totalPages)" 
                    :disabled="currentPage === totalPages" 
                    class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none disabled:bg-gray-300"
                >
                    Última
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalService from "../../../services/GlobalServices";
import dayjs from "dayjs"; // Importa dayjs
import * as XLSX from "xlsx"; // Importa la librería de xlsx
    export default {
        name: "list-surveys",
        data() {
            return {
                rows: [],
                currentPage: 1,
                totalSurveys: 0,
                perPage: 5,
            };
        },
        mounted() {
            this.getDataSurveys();
        },
        computed: {
            totalPages() {
                return Math.ceil(this.totalSurveys / this.perPage);
            }
        },
        methods: {
            getDataSurveys() {
                GlobalService.getData(`/survey/list-survey?page=${this.currentPage}&perPage=${this.perPage}`)
                    .then((response) => {
                    console.log(response)
                        this.rows = response.surveys.map((survey) => ({
                            id: survey.id,
                            q_1: survey.Q_1,
                            q_2: survey.Q_2,
                            q_3: survey.Q_3,
                            q_4: dayjs(survey.Q_4).isValid() ? dayjs(survey.Q_4).format("DD-MM-YYYY") : "", // Aquí se maneja el caso "Invalid Date"
                            q_5: survey.Q_5,
                            q_6: survey.Q_6,
                            q_7: survey.Q_7,
                            q_8: survey.Q_8,
                            q_9: survey.Q_9,
                            companyRut: survey.company.rut,
                            companyName: survey.company.name,
                            companyCode: survey.company.code,
                            status: survey.status,
                            date: dayjs(survey.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                            username: survey.company.user.username,
                        }));
                         this.totalSurveys = response.pagination.totalSurveys;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },

        downloadSurveys() {
            GlobalService.getFile("/survey/download-surveys")
                .then((response) => {
                const blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "Encuestas.xlsx";
                link.click();

                window.URL.revokeObjectURL(link.href);
                })
                .catch((error) => {
                console.error("Error al descargar encuestas:", error);
                this.toast.error("Error al descargar el archivo de encuestas.");
                });
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
            this.getDataSurveys();
        },
        },
    };
</script>
<style>
/* Asegura que la tabla tenga un tamaño fijo y con desplazamiento vertical */
table {
    width: 100%;
    border-collapse: collapse; /* Asegura que las celdas no tengan bordes adicionales */
}

th, td {
    overflow: hidden;
    text-overflow: ellipsis;
    height: 100px;
}

.first-letter-uppercase::first-letter {
    text-transform: uppercase;
}
</style>