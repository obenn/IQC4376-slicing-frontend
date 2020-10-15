import axios from 'axios'
import Vue from 'vue'
// TODO: Stop using full bundle, see https://vuematerial.io/getting-started
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import App from './App.vue'

Vue.use(VueMaterial)
Vue.config.productionTip = false
Vue.prototype.$http = axios.create();

new Vue({
  render: h => h(App),
}).$mount('#app')
