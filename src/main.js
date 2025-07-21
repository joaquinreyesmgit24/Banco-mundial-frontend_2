import { createApp } from 'vue'
import store from './store'
import './style.css';
import 'remixicon/fonts/remixicon.css';
import Toast from 'vue-toastification'
import { options } from './notifications/toast.js'
import VueApexCharts from "vue3-apexcharts";
import App from './App.vue';
import router from './router';

createApp(App).use(router).use(store).use(Toast, options).use(VueApexCharts).mount('#app')
function checkRole(route, userRoles) {
    if(route.meta.requiredRole){
        return route.meta.requiredRole.includes(userRoles)
    }
    else{
        return true;
    }
}
router.beforeEach((to, from, next) => {
    // // Aquí verifica el rol del usuario actual, reemplaza 'userRoles' con el método o la variable que contenga los roles del usuario

    if (to.meta.requiresAuth && !store.getters['haveToken']) {
        next({ name: 'login' });
    } else {
        console.log("Enrutamiento: " + to.name);
        console.log("test");
        // Comprueba si el usuario está autenticado antes de verificar el rol
        const isAuthenticated = store.getters['haveToken'];
        if (isAuthenticated) {
            const userRoles = store.getters['getRolName'];

            if (!checkRole(to, userRoles)) {
                // El usuario no tiene el rol necesario para acceder a esta ruta
                // Puedes redirigirlo a una página de error o hacer lo que desees
                if(userRoles==='Administrador'){
                    next({ name: 'users' })
                }else{
                    next({ name: 'contact' })
                }
            } else {
                next();
            }
        } else {
            // El usuario no está autenticado, pero la ruta no requiere autenticación.
            // Simplemente continua con la navegación.
            next();
        }
    }
});
