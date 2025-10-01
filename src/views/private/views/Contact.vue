<template>
    <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <h2 v-if="!randomCompany" class="text-center">
                <span v-if="this.$route.params.companyId">La empresa no se puede contactar debido a que no tiene
                    llamados
                    disponibles o ya tiene un reporte</span>
                <span v-else>No hay empresas disponibles para contactar</span>
                <i class="ri-error-warning-fill ml-2"></i>
            </h2>
            <form v-else @submit.prevent class="border border-neutral-200 rounded-md p-4 md:p-5 bg-neutral-50">
                <div class="grid gap-2 mb-4 grid-cols-2">
                    <div class="col-span-2 mb-3">
                        <h2 class="font-bold mb-4 text-center">INTRODUCCIÓN</h2>
                        <p class="text-gray-600 text-center mb-5 font-bold">
                            <span class="text-blue-500">(Buenos días/Buenas tardes/Buenas noches)</span>. Le llamo de la
                            empresa Datavoz, en nombre del Banco Mundial. Estamos
                            llevando a cabo una encuesta del sector privado en chile
                            para comprender mejor el entorno empresarial y las restricciones que enfrentan empresas como
                            la suya.
                        </p>

                        <label for="code" class="block mb-2 text-sm font-medium text-gray-900">Seleccionar
                            número:</label>
                        <div class="flex">
                            <div class="mr-4">
                                <div
                                    v-if="randomCompany.phoneNumberOne && randomCompany.numberPhoneCallsOne>0 && randomCompany.numberPhoneCallsOne>randomCompany.callsByPhoneOne">
                                    <input type="radio" name="number" :value="randomCompany.phoneNumberOne"
                                        v-model="call.phone">
                                    {{ randomCompany.phoneNumberOne }}
                                </div>
                            </div>
                            <div>
                                <div
                                    v-if="randomCompany.phoneNumberSecond && randomCompany.numberPhoneCallsSecond>0 && randomCompany.numberPhoneCallsSecond>randomCompany.callsByPhoneTwo">
                                    <input type="radio" name="number" :value="randomCompany.phoneNumberSecond"
                                        v-model="call.phone">
                                    {{ randomCompany.phoneNumberSecond }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-2 mb-3">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Rut de la
                            empresa:</label>
                        <input type="text" name="name" id="name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                            placeholder="Rut" disabled v-model="randomCompany.rut" />
                    </div>
                    <div class="col-span-2 mb-3">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nombre de la
                            empresa:</label>
                        <input type="text" name="name" id="name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                            placeholder="Nombre" disabled v-model="randomCompany.name" />
                    </div>
                    <div class="col-span-2 mb-3">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Dirección de la
                            empresa:</label>
                        <input type="text" name="name" id="name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                            placeholder="Nombre" disabled v-model="randomCompany.street" />
                    </div>
                    <div class="col-span-2 mb-3">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">En caso de que la
                            dirección no coincida:</label>
                        <input type="text" name="name" id="name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                            placeholder="Ingresar nueva dirección" v-model="survey.companyStreetUpdate" />
                    </div>
                    <div class="col-span-2 mb-3">
                        <div class="col-span-2 mb-3">
                            <label for="emailSendTo" class="block mb-2 text-sm font-bold text-blue-600">
                                ¿Desea recibir algún correo con la información?:
                            </label>
                            <div class="flex space-x-2">
                                <input type="email" name="emailSendTo" id="emailSendTo" placeholder="Ingresar correo electrónico"
                                    v-model.trim="emailToSend.to"
                                    class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 placeholder-gray-400" />

                                <button type="button"
                                @click="sendEmail()"
                                    class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-800 transition">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div class="bg-white p-6 rounded-md w-5xl ml-20 max-h-[80vh] overflow-auto">
                        <div class="col-span-2 mb-3"
                            v-if="call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4">
                            <label for="participate" class="block mb-2 text-sm font-medium text-gray-900">¿Quiere
                                participar
                                del estudio?</label>
                            <input type="checkbox" @change="handleParticipateChange" id="participate"
                                v-model="participate" class="mr-2" />
                            <span>Sí</span>
                        </div>
                        <label for="mainSelect"
                            v-if="(call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4) && !participate">
                            Seleccione una opción:
                        </label>

                        <select
                            v-if="(call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4) && !participate"
                            id="mainSelect" v-model="survey.selectedMainStatus">
                            <option v-for="option in mainOptions1" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                        <div
                            v-if="(call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4) && !participate && survey.selectedMainStatus === 3">
                            <label for="subSelect">Motivo del rechazo:</label>
                            <select v-model="survey.selectedSubStatus" id="subSelect">
                                <option v-for="subOption in subOptions1" :key="subOption.value"
                                    :value="subOption.value">
                                    {{ subOption.label }}
                                </option>
                            </select>
                        </div>
                        <div
                            v-if="(call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4) && participate">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2">
                                    1. Es de propiedad total del gobierno central, regional o municipal
                                </label>
                                <div class="flex items-center mb-4">
                                    <label class="inline-flex items-center mr-4">
                                        <input type="radio" class="form-radio" name="Q_1" v-model="survey.Q_1"
                                            value="1">
                                        <span class="ml-2">Sí</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input type="radio" class="form-radio" name="Q_1" v-model="survey.Q_1"
                                            value="2">
                                        <span class="ml-2">No</span>
                                    </label>
                                </div>
                            </div>
                            <div class="mb-4" v-if="survey.Q_1==2">
                                <label class="block text-gray-700 text-sm font-bold mb-2">2. Por favor dígame ¿qué
                                    actividad
                                    representa la
                                    mayor proporción de las ventas anuales?</label>
                                <div class="flex items-center">
                                    <input id="fabricacion" name="Q_2" type="radio" value="1" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="fabricacion"
                                        class="ml-3 block text-sm font-medium text-gray-700">Fabricación</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="impresion" name="Q_2" type="radio" value="11" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="impresion"
                                        class="ml-3 block text-sm font-medium text-gray-700">Impresión (y
                                        reproducción de
                                        grabaciones)</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="comercio_minorista" name="Q_2" type="radio" value="2"
                                        v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="comercio_minorista"
                                        class="ml-3 block text-sm font-medium text-gray-700">Comercio
                                        minorista</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="comercio_mayorista" name="Q_2" type="radio" value="3"
                                        v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="comercio_mayorista"
                                        class="ml-3 block text-sm font-medium text-gray-700">Comercio
                                        mayorista</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="construccion" name="Q_2" type="radio" value="4" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="construccion"
                                        class="ml-3 block text-sm font-medium text-gray-700">Construcción</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="hotel" name="Q_2" type="radio" value="51" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="hotel"
                                        class="ml-3 block text-sm font-medium text-gray-700">Hotel</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="restaurante" name="Q_2" type="radio" value="52" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="restaurante"
                                        class="ml-3 block text-sm font-medium text-gray-700">Restaurante</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="transporte" name="Q_2" type="radio" value="61" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="transporte"
                                        class="ml-3 block text-sm font-medium text-gray-700">Transporte,
                                        almacenamiento,
                                        servicios de mensajería</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="publicacion" name="Q_2" type="radio" value="62" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="publicacion"
                                        class="ml-3 block text-sm font-medium text-gray-700">Actividades de
                                        publicación</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="telecomunicaciones" name="Q_2" type="radio" value="63"
                                        v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="telecomunicaciones"
                                        class="ml-3 block text-sm font-medium text-gray-700">Telecomunicaciones,
                                        programación informática</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="servicios_profesionales" name="Q_2" type="radio" value="64"
                                        v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="servicios_profesionales"
                                        class="ml-3 block text-sm font-medium text-gray-700">Servicios
                                        profesionales legales, de arquitectura, publicidad, veterinaria u otros</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="reparacion" name="Q_2" type="radio" value="65" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="reparacion"
                                        class="ml-3 block text-sm font-medium text-gray-700">Reparación
                                        de computadores
                                        o artículos del hogar</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="agencia_viajes" name="Q_2" type="radio" value="66" v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="agencia_viajes"
                                        class="ml-3 block text-sm font-medium text-gray-700">Agencia
                                        de viajes u
                                        operador de tures</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="ninguno_de_los_anteriores" name="Q_2" type="radio" value="-9"
                                        v-model="survey.Q_2"
                                        class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500">
                                    <label for="ninguno_de_los_anteriores"
                                        class="ml-3 block text-sm font-medium text-gray-700">Ninguno de los
                                        anteriores</label>
                                </div>
                            </div>
                            <div class="mb-4" v-if="survey.Q_1==2 && (survey.Q_2!='' && survey.Q_2!=-9)">
                                <label class="block text-gray-700 text-sm font-bold mb-2">3. ¿Cuántos trabajadores tiene
                                    este
                                    establecimiento?</label>
                                <label class="block text-gray-700 text-sm mb-2">Número de trabajadores:</label>
                                <div class="flex items-center">
                                    <input type="number" id="Q_3" class="form-input mt-1 block w-full" placeholder="0"
                                        v-model="survey.Q_3" />
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="(call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4) && participate && survey.Q_1==2 && survey.Q_2!=-9 && survey.Q_3>=5 ">
                            <label class="block text-gray-700 text-sm font-bold mb-2">S.12. INFORMACIÓN DE LA
                                CITA:</label>
                            <label class="block text-gray-700 text-sm mb-2">Nos gustaría programar una cita para una
                                entrevista. El
                                propósito de esta encuesta es comprender mejor <br> las condiciones de las empresas
                                privadas
                                y
                                cómo
                                afectan la productividad y el crecimiento.<br> Sus respuestas y las de otros líderes
                                empresariales
                                ayudarán a diseñar nuevas políticas <br> y programas para mejorar el entorno
                                empresarial.
                                Toda la
                                información que proporcione será anónima <br> y ni su nombre ni el nombre de su
                                establecimiento
                                se
                                utilizarán en ningún documento basado en esta encuesta. <br> Si lo desea, puede ver los
                                resultados
                                de encuestas anteriores y el tipo de indicadores generados a partir <br> de estos datos
                                visitando
                                el
                                sitio web del Banco Mundial:
                                <a href="http://www.enterprisesurveys.org/"
                                    target="_blank">http://www.enterprisesurveys.org/</a></label>

                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="fechaC">FECHA DE LA
                                    CITA (OBLIGATORIO):</label>
                                <input type="date" id="fechaC" v-model="survey.Q_4"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="horaC">HORA
                                    (OBLIGATORIO):</label>
                                <input type="time" id="horaC" v-model="survey.Q_5" :disabled="!survey.Q_4"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="nombreE">NOMBRE DEL
                                    ENTREVISTADO (OBLIGATORIO):</label>
                                <input type="text" id="nombreE" v-model="survey.Q_6"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    :disabled="!survey.Q_5" placeholder="Nombre">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="cargoE">CARGO DEL
                                    ENTREVISTADO (OBLIGATORIO):</label>
                                <input type="text" id="cargoE" v-model="survey.Q_7"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    :disabled="!survey.Q_6" placeholder="Cargo">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="cargoE">CORREO DEL
                                    ENTREVISTADO (OBLIGATORIO):</label>
                                <input type="text" id="correoE" v-model="survey.Q_8"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    :disabled="!survey.Q_7" placeholder="Correo">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="cargoE">CELULAR DEL
                                    ENTREVISTADO (OPCIONAL):</label>
                                <input type="text" id="celularE" v-model="survey.Q_9"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    :disabled="!survey.Q_8" placeholder="Celular">
                            </div>
                        </div>
                        <label for="mainSelect"
                            v-if="(call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4) && participate && survey.Q_7!=''">Seleccione
                            una opción:</label>
                        <select v-model="survey.selectedMainStatus"
                            v-if="(call.incidenceId == 1 || call.incidenceId === 2 || call.incidenceId === 3 || call.incidenceId === 4) && participate && survey.Q_7!=''"
                            id="mainSelect">
                            <option v-for="option in mainOptions2" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                        <div v-if="(participate && (survey.selectedMainStatus!=2 && survey.selectedMainStatus!=3)) && (survey.Q_1==1 || survey.Q_2==-9 || (survey.Q_3!='' && survey.Q_3<5))"
                            class="flex justify-center">
                            <button type="submit" @click="createCall(call,'empresa-no-elegible')"
                                class="w-full mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">La
                                empresa no es elegible</button>
                        </div>
                        <div v-if="(participate && survey.selectedMainStatus!='' && survey.Q_1!='' && survey.Q_2!='' && survey.Q_3!='' && survey.Q_4!='' && survey.Q_5!=''&& survey.Q_6!=''&& survey.Q_7!='' && survey.Q_8!='') && (survey.Q_1==2 && survey.Q_2!=-9 && survey.Q_3>=5)"
                            class="flex justify-center">
                            <button type="submit" @click="createCall(call,'finalizar')"
                                class="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Finalizar
                                encuesta</button>
                        </div>
                        <div v-if="!participate && survey.selectedMainStatus ==3 &&  survey.selectedSubStatus != ''"
                            class="flex justify-center">
                            <button @click="createCall(call, 'no-desea-participar')"
                                class="w-full mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">No
                                desea participar</button>
                        </div>

                        <div v-if="!participate && survey.selectedMainStatus ==2 &&  survey.selectedSubStatus == ''"
                            class="flex justify-center">
                            <button @click="createCall(call, 'no-desea-participar')"
                                class="w-full mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">No
                                desea participar</button>
                        </div>
                    </div>
                </div>
                <div class="col-span-2 mb-3"
                    v-if="call.incidenceId != '' && call.incidenceId != 1 && call.incidenceId != 2 && call.incidenceId != 3 && call.incidenceId != 4 && call.incidenceId != 7">
                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900">
                        Comentario:</label>
                    <textarea name="comentarios" rows="5" cols="165" v-model="call.comment"></textarea>
                </div>

                <div class="col-span-2 mb-7" v-if="call.incidenceId == 7">
                    <label for="reschedulingDate" class="block mb-2 text-sm font-medium text-gray-900">Fecha de
                        reprogramación de llamado:</label>
                    <input type="date" name="reschedulingDate" id="reschedulingDate" v-model="call.rescheduled.date"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500" />
                </div>
                <div class="col-span-2 mb-7" v-if="call.incidenceId == 7">
                    <label for="reschedulingTime" class="block mb-2 text-sm font-medium text-gray-900">Hora de
                        reprogramación de llamado:</label>
                    <input type="time" name="reschedulingTime" id="reschedulingTime" v-model="call.rescheduled.time"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500" />
                </div>
                <button type="submit" @click="createCall(call,'agregar-incidencia')" v-if="call.incidenceId === 7"
                    class="w-full text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm py-2.5 mb-6 text-center">
                    Reprogramar llamado
                </button>
                <div class="col-span-2 mb-3">
                    <label for="incidence" class="block mb-2 text-sm font-medium text-gray-900">Incidencia:</label>
                    <select id="incidence"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                        v-model="call.incidenceId">
                        <option value="" disabled selected>
                            Seleccionar incidencia
                        </option>
                        <option v-for="incidence in incidents" :key="incidence.id" :value="incidence.id">
                            {{ incidence.description }}
                        </option>
                    </select>
                </div>
                <div class="col-span-2 mb-3" v-if="call.incidenceId == 13">
                    <label for="rejection" class="block mb-2 text-sm font-medium text-gray-900">Motivo del rechazo:</label>
                    <select id="rejection"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 placeholder-gray-400 focus:ring-primary-500"
                        v-model="call.selectedSubStatus">
                        <option value="" disabled selected>
                            Seleccionar motivo del rechazo
                        </option>
                        <option v-for="option in subOptions1" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
                <button @click="openModal();createCall(call,'agregar-incidencia')"
                    v-if="call.incidenceId!='' && (call.incidenceId == 1 || call.incidenceId ==2 || call.incidenceId == 3 || call.incidenceId == 4)"
                    class="w-full text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm py-2.5 mb-6 text-center">
                    Iniciar encuesta
                </button>
                <button type="submit" @click="createCall(call,'agregar-incidencia')"
                    v-if="call.incidenceId!='' && call.incidenceId != 1 && call.incidenceId != 2 && call.incidenceId != 3 && call.incidenceId != 4 && call.incidenceId != 7"
                    class="w-full text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm py-2.5 mb-6 text-center">
                    Agregar incidencia
                </button>
                <table class="min-w-full bg-white border border-gray-300 text-sm text-left">
                    <thead class="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-300">
                        <tr>
                            <th class="py-2 px-4 border border-gray-300">Teléfono</th>
                            <th class="py-2 px-4 border border-gray-300">Incidencia</th>
                            <th class="py-2 px-4 border border-gray-300">Comentario</th>
                            <th class="py-2 px-4 border border-gray-300">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="call in calls" :key="call.id" class="border-t border-gray-300">
                            <td class="py-2 px-4 border border-gray-300">{{ call.phone }}</td>
                            <td class="py-2 px-4 border border-gray-300">{{ call.incident.description }}</td>
                            <td class="py-2 px-4 border border-gray-300">{{ call.comment || 'Sin comentario' }}</td>
                            <td class="py-2 px-4 border border-gray-300">{{ new Date(call.date).toLocaleDateString() }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <button type="submit" v-if="!this.$route.params.companyId" @click="changeContact()"
                class="mt-5 px-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-3.5 mb-6 text-center">
                Cambiar de contacto
            </button>
        </div>
    </div>
</template>

<script>
    import GlobalService from "../../../services/GlobalServices";
    import { mapGetters } from "vuex";
    import { VueGoodTable } from "vue-good-table-next";
    import "vue-good-table-next/dist/vue-good-table-next.css";
    import { useToast } from "vue-toastification";
    import dayjs from "dayjs"; // Importa dayjs
    import { DateTime } from 'luxon';

    export default {
        name: "list-users",
        components: {
            VueGoodTable,
        },
        data() {
            return {
                survey: {
                    companyId: "",
                    Q_1: "",
                    Q_2: "",
                    Q_3: "",
                    Q_4: "",
                    Q_5: "",
                    Q_6: "",
                    Q_7: "",
                    Q_8: "",
                    Q_9: "",
                    selectedMainStatus: "",
                    selectedSubStatus: "",
                    companyStreetUpdate: "",
                    incidenceId: "",
                },
                participate: true,
                calls: [],
                incidents: [],
                randomCompany: "",
                toast: useToast(),
                showRejectButton: true,
                buttonNext: false,
                emailToSend:{
                    to:"",
                    companyName: ""
                },
                call: {
                    phone: "",
                    comment: "",
                    date: DateTime.now().setZone("America/Santiago").toFormat("yyyy-MM-dd HH:mm:ss"),
                    companyId: "",
                    incidenceId: "",
                    companyStreetUpdate: "",
                    selectedSubStatus:"",
                    rescheduled: {
                        date: "",
                        time: ""
                    }
                },
            }
        },
        mounted() {
            this.getDataIncidents()
            this.getDataRandomCompany()
            if (this.$route.params.companyId) {
                this.getSelectCompanyToCallById(this.$route.params.companyId)
            }
            else {
                this.getDataRandomCompany(this.getUserID)
            }

            this.mainOptions1 = [
                { label: "Entrevista efectiva incompleta", value: 2 },
                { label: "Rechazo a la entrevista", value: 3 },
            ]
            this.subOptions1 = [
                { label: "No desea participar", value: 1 },
                { label: "No tiene tiempo para participar", value: 2 },
                { label: "Lejos de la ciudad/de viaje", value: 3 },
                { label: "No le interesa el tema", value: 4 },
                { label: "No responder a ninguna encuesta como norma general", value: 5 },
                { label: "Otros", value: 6 },
            ]

            this.mainOptions2 = [
                { label: "Entrevista completa con implementación presencial", value: 1 },
                { label: "Entrevista completa con implementación en video", value: 5 },
                { label: "Entrevista completa con implementación mixta", value: 6 },
                { label: "Elegible en proceso para hacer una cita", value: 4 },
            ]

        },
        methods: {
            handleParticipateChange() {
                this.survey = {
                    companyId: this.survey.companyId, // Mantenemos este si ya está seteado
                    Q_1: "",
                    Q_2: "",
                    Q_3: "",
                    Q_4: "",
                    Q_5: "",
                    Q_6: "",
                    Q_7: "",
                    Q_8: "",
                    Q_9: "",
                    selectedMainStatus: "",
                    selectedSubStatus: "",
                    companyStreetUpdate: this.survey.companyStreetUpdate
                }
            },
            changeContact() {
                window.location.reload()
            },
            openModal() {
                this.isModalOpen = true;
            },
            closeModal() {
                this.isModalOpen = false;
            },
            sendEmail(){
                 // Verificar si el campo de correo electrónico está vacío o tiene un formato incorrecto
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!this.emailToSend.to || !emailRegex.test(this.emailToSend.to)) {
                    this.toast.error('Por favor ingrese un correo electrónico válido.');
                    return;  // No enviar si el correo es inválido o vacío
                }
                this.emailToSend.companyName = this.randomCompany.name
                GlobalService.createData("/call/send-email", this.emailToSend).then((response)=>{
                this.toast.success(response.data.msg);
                }).catch((e) => {
                            let errors = e.response.data.errors;
                            let error = e.response.data.error;
                            console.log(errors)
                            if (errors) {
                                errors.forEach((error_element) => {
                                    this.toast.error(error_element.msg);
                                });
                            } else {
                                this.toast.error(error);
                            }
                        })
            },
            createCall(call, option) {
                call.companyStreetUpdate = this.survey.companyStreetUpdate;
                if (call.incidenceId === 13 && call.selectedSubStatus === "") {
                    this.toast.error('Por favor, seleccione un motivo de rechazo antes de continuar.');
                    return;  // Se detiene la ejecución aquí
                }
                if (option == 'agregar-incidencia') {
                    GlobalService.createData("/call/create-call", call)
                            .then((response) => {
                                this.toast.success(response.data.msg);
                                this.getDataCalls(this.randomCompany.id)
                                if (call.incidenceId != 1 && call.incidenceId != 2 && call.incidenceId != 3 && call.incidenceId != 4) {
                                    window.location.reload()
                                }
                            })
                            .catch((e) => {
                                let errors = e.response.data.errors;
                                let error = e.response.data.error;
                                console.log(errors)
                                if (errors) {
                                    errors.forEach((error_element) => {
                                        this.toast.error(error_element.msg);
                                    });
                                } else {
                                    this.toast.error(error);
                                }
                        })
                }
                if (option == 'no-desea-participar' || option == 'finalizar' || option == 'empresa-no-elegible') {
                    this.survey.incidenceId = this.call.incidenceId
                    GlobalService.createData("/survey/create-survey", this.survey).then((response) => {
                        window.location.reload()
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
                        })
                }

            },
            getDataIncidents() {
                GlobalService.getData("/call/list-incidents")
                    .then((response) => {
                        this.incidents = response.incidents
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getDataRandomCompany(userId) {
                GlobalService.getData(`/call/get-random-company/${userId}`)
                    .then((response) => {
                        this.randomCompany = response
                        this.call.companyId = response.id
                        this.survey.companyId = response.id
                        this.call.phone = response.phoneNumberOne
                        this.getDataCalls(response.id)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getSelectCompanyToCallById(companyId) {
                GlobalService.getData(`/call/get-select-company-to-call-by-id/${companyId}`)
                    .then((response) => {
                        this.randomCompany = response
                        this.call.companyId = response.id
                        this.survey.companyId = response.id
                        this.call.phone = response.phoneNumberOne
                        this.getDataCalls(response.id)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            getDataCalls(companyId) {
                GlobalService.getData(`/call/list-calls/${companyId}`)
                    .then((response) => {
                        this.calls = response.calls
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        computed: {
            ...mapGetters(["getUserID"]),
            currentPage() {
                return Number(this.$route.params.page) || 1;
            }
        },
    };
</script>

<style scoped>
    .spinner {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>