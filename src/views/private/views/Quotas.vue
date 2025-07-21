<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div v-for="quota in quotas" :key="quota.id" class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <form class="border border-neutral-200 rounded-md p-4 md:p-5 bg-neutral-50">
                <div class="grid gap-2 mb-4 grid-cols-2">
                    <div class="col-span-1">
                        <label for="sampleSector"
                            class="block mb-2 text-sm font-medium text-gray-900">Sector de la muestra:</label>
                        <select id="sampleSector"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                            v-model="quota.sampleSize.id">
                            <option value="" selected>
                                Seleccionar sector de la muestra
                            </option>
                            <option :key="quota.sampleSize.id" :value="quota.sampleSize.id" disable>
                                {{ quota.sampleSize.description }}
                            </option>
                        </select>
                    </div>
                    <!-- Campo para modificar la cantidad -->
                    <div class="col-span-1">
                        <label for="quotaAmount" class="block mb-2 text-sm font-medium text-gray-900">
                            Modificar cantidad:
                        </label>
                        <input type="number" id="quotaAmount" 
                        v-model="quota.quantity"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        placeholder="Nueva cantidad">
                    </div>
                </div>
                <button type="button" @click="updateQuota(quota.id, quota)" class="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Actualizar Cuota
                </button>
            </form>
        </div>
        
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import { useToast } from "vue-toastification";

export default {
    data() {
        return {
            toast: useToast(),
            quotas: [] // Lista de cuotas
        };
    },
    mounted() {
        this.getQuotas(); // Cargar cuotas cuando el componente se monte
    },
    methods: {
        // Obtener las cuotas desde el backend
        getQuotas() {
            GlobalService.getData("/quota/list-quotas") // Ruta para obtener las cuotas
                .then(response => {
                    // Añadir un campo para la edición de cantidad
                    this.quotas = response.quotas
                })
                .catch(error => {
                    console.error("Error al obtener cuotas:", error);
                });
        },

        // Actualizar la cuota seleccionada
        updateQuota(quotaId,quota) {
            console.log(quotaId,quota)
                GlobalService.setData(`/quota/update-quota`,quotaId, quota)
                    .then(response => {
                        this.toast.success(response.msg);
                        this.quotas = response.quotas

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
        
    }
};
</script>

<style>
/* Estilos si es necesario */
</style>