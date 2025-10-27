<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between items-center mb-4">
                <div class="text-xl font-semibold">Reportes</div>
                <button class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" @click="downloadReports">
                    Descargar Reportes (Excel)
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th class="px-6 py-3">Id</th>
                            <th class="px-6 py-3">Empresa</th>
                            <th class="px-6 py-3">Estratificación región</th>
                            <th class="px-6 py-3">Tamaño</th>
                            <th class="px-6 py-3">Sector</th>
                            <th class="px-6 py-3">Panel</th>
                            <th class="px-6 py-3">Código de elegibilidad</th>
                            <th class="px-6 py-3">Código de estado</th>
                            <th class="px-6 py-3">Código de rechazo</th>
                            <th class="px-6 py-3">Dirección</th>
                            <th class="px-6 py-3">Teléfonos</th>
                            <th class="px-6 py-3">Encuestador</th>
                            <th class="px-6 py-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 lowercase">
                            <td class="px-6 py-3">{{ row.id }}</td>
                            <td class="px-6 py-3">{{ row.companyName }}</td>
                            <td class="px-6 py-3">{{ row.nameStratificationRegion }}</td>
                            <td class="px-6 py-3">{{ row.nameSizeStratification }}</td>
                            <td class="px-6 py-3">{{ row.nameStratificationSector }}</td>
                            <td class="px-6 py-3">{{ row.panelName }}</td>
                            <td class="px-6 py-3">{{ row.eligibilityCode }}</td>
                            <td class="px-6 py-3">{{ row.statusCode }}</td>
                            <td class="px-6 py-3">{{ row.rejectionCode }}</td>
                            <td class="px-6 py-3">{{ row.address }}</td>
                            <td class="px-6 py-3">{{ row.phoneNumberOne }} / {{ row.phoneNumberSecond }}</td>
                            <td class="px-6 py-3">{{ row.username }}</td>
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
import dayjs from "dayjs";
import * as XLSX from "xlsx"; // Importa la librería de xlsx

export default {
    name: "list-reports",
    data() {
        return {
            rows: [],
            currentPage: 1,
            totalReports: 0,
            perPage: 5,
        };
    },
    mounted() {
        this.getDataReports();
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalReports / this.perPage);
        }
    },
    methods: {
        getDataReports() {
            GlobalService.getData(`/report/list-reports?page=${this.currentPage}&perPage=${this.perPage}`)
                .then((response) => {
                    console.log(response)
                    this.rows = response.reports.map((report) => ({
                        id: report.id,
                        companyName: report.companyName,
                        countryName: report.countryName,
                        nameStratificationRegion: report.nameStratificationRegion,
                        nameSizeStratification: report.nameSizeStratification,
                        nameStratificationSector: report.nameStratificationSector,
                        panelName: report.panelName,
                        eligibilityCode: report.eligibilityCode,
                        rejectionCode: report.rejectionCode,
                        statusCode: report.statusCode,
                        address: report.address,
                        phoneNumberOne: report.phoneNumberOne,
                        phoneNumberSecond: report.phoneNumberSecond,
                        username: report.company.user.username,
                        date: dayjs(report.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                    }));
                    this.totalReports = response.pagination.totalReports;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        downloadReports() {
                GlobalService.getFile("/report/download-reports")
                .then((response) => {
                const blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "Reportes.xlsx";
                link.click();
                window.URL.revokeObjectURL(link.href);
                })
                .catch((error) => {
                console.error("Error al descargar reportes:", error);
                this.toast.error("Error al descargar el archivo de reportes.");
                });
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
            this.getDataReports();
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
    height: 100px;
}

.first-letter-uppercase::first-letter {
    text-transform: uppercase;
}

</style>
