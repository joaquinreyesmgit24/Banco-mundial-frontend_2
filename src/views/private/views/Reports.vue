<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <div class="flex justify-between items-center mb-4">
                <div class="text-2xl font-semibold">Reportes</div>
                <button class="text-white inline-flex items-center bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" @click="downloadReports">
                    Descargar Reportes (Excel)
                </button>
            </div>
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
import dayjs from "dayjs";
import * as XLSX from "xlsx"; // Importa la librería de xlsx

export default {
    name: "list-reports",
    components: {
        VueGoodTable,
    },
    data() {
        return {
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
                { label: "Empresa", field: "companyName" },
                { label: "Nombre del país", field: "countryName" },
                { label: "Nombre de estratificación por región", field: "nameStratificationRegion" },
                { label: "Tamaño", field: "nameSizeStratification" },
                { label: "Sector", field: "nameStratificationSector" },
                { label: "Panel", field: "panelName" },
                { label: "Código de elegibilidad", field: "eligibilityCode" },
                { label: "Código de estado", field: "statusCode" },
                { label: "Dirección", field: "address" },
                { label: "Teléfono 1", field: "phoneNumberOne" },
                { label: "Teléfono 2", field: "phoneNumberSecond" },
            ],
            rows: [],
        };
    },
    mounted() {
        this.getDataReports();
    },
    methods: {
        getDataReports() {
            GlobalService.getData("/report/list-reports")
                .then((response) => {
                 console.log(response.reports)
                    this.rows = response.reports.map((report) => ({
                        id: report.id,
                        countryName: report.countryName,
                        countryCode: report.countryCode,
                        nameStratificationRegion: report.nameStratificationRegion,
                        regionalStratificationCode: report.regionalStratificationCode,
                        nameSizeStratification: report.nameSizeStratification,
                        sizeStratificationCode: report.sizeStratificationCode,
                        nameStratificationSector: report.nameStratificationSector,
                        sectorStratificationCode: report.sectorStratificationCode,
                        panelName: report.panelName,
                        panelCode: report.panelCode,
                        eligibilityCode: report.eligibilityCode,
                        statusCode: report.statusCode,
                        rejectionCode: report.rejectionCode,
                        companyName: report.companyName,
                        locality: report.locality,
                        address: report.address,
                        zipCode: report.zipCode,
                        contactPerson: report.contactPerson,
                        contactPosition: report.contactPosition,
                        phoneNumberOne: report.phoneNumberOne,
                        phoneNumberSecond: report.phoneNumberSecond,
                        faxNumber: report.faxNumber,
                        emailAddress: report.emailAddress,
                        web: report.web,
                        companyStreetUpdate: report.companyStreetUpdate,
                        date: dayjs(report.createdAt).format("DD-MM-YYYY HH:mm:ss"),
                    }))
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        downloadReports() {
            const headersMap = {
                companyName: 'Nombre de la Compañía',
                countryName: 'Nombre del País',
                countryCode: 'Código del País',
                nameStratificationRegion: 'Región de Estratificación',
                regionalStratificationCode: 'Código de Estratificación Regional',
                nameSizeStratification: 'Tamaño de la Estratificación',
                sizeStratificationCode: 'Código de Estratificación de Tamaño',
                nameStratificationSector: 'Sector de Estratificación',
                sectorStratificationCode: 'Código de Estratificación de Sector',
                panelName: 'Nombre del Panel',
                panelCode: 'Código del Panel',
                eligibilityCode: 'Código de Elegibilidad',
                statusCode: 'Código de Estado',
                rejectionCode: 'Código de Rechazo',
                locality: 'Localidad',
                address: 'Dirección',
                zipCode: 'Código Postal',
                contactPerson: 'Persona de Contacto',
                contactPosition: 'Cargo de Contacto',
                phoneNumberOne: 'Teléfono 1',
                phoneNumberSecond: 'Teléfono 2',
                faxNumber: 'Número de Fax',
                emailAddress: 'Correo Electrónico',
                web: 'Página Web',
                companyStreetUpdate: 'Dirreción de la Compañía (Actualización)',
                date: 'Fecha de Creación',
            };
            const formattedRows = this.rows.map((row) => {
                const formattedRow = {};
                for (const key in row) {
                    if (headersMap[key]) {
                        formattedRow[headersMap[key]] = row[key]; // Asigna el valor con el nuevo nombre de campo
                    } else {
                        formattedRow[key] = row[key]; // Si no hay mapeo, conserva el nombre original
                    }
                }
                return formattedRow;
            });

            // Crea una nueva hoja de Excel con los encabezados modificados
            const ws = XLSX.utils.json_to_sheet(formattedRows);

            // Crea un libro de trabajo (workbook)
            const wb = XLSX.utils.book_new();

            // Agrega la hoja de Excel al libro de trabajo
            XLSX.utils.book_append_sheet(wb, ws, "Reportes");

            // Descarga el archivo Excel
            XLSX.writeFile(wb, "reportes.xlsx");
        },
    },
};
</script>

<style></style>
