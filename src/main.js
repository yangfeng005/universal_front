import Vue from 'vue';
import 'normalize.css/normalize.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/default.less';
import App from './App';
import router from '@/router';
import store from './store';
import '@/router/permission';
import lodash from 'lodash';
import moment from 'moment';

moment.locale('zh-cn');
Vue.prototype._ = lodash;
Vue.prototype.$moment = moment;
Vue.prototype.PUBLIC_PATH = process.env.VUE_APP_PUBLIC_PATH;
Vue.prototype.BASE_URL = process.env.VUE_APP_BASE_URL + process.env.VUE_APP_BASE_API;
Vue.prototype.getFile = (id) => `${Vue.prototype.BASE_URL}/file/download?fileId=${id}`;

Vue.use(ElementUI, { size: 'mini' });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
