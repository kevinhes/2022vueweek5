import config from "./config.js";
import modal from "../components/modal.js";
import pagination from "../components/pagination.js";

const app = Vue.createApp({
  data() {
    return {
      productsData: '',
      pagination: {},
      cartsData: {},
      isLoading: false,
      tempProductId: '',
      userInfo: {
        "data": {
          "user": {
            "name": "",
            "email": "",
            "tel": "",
            "address": ""
          },
          "message": ""
        }
      }
    };
  },
  components:{
    modal,
    pagination
  },
  methods: {
    getProductsData(page =1) {
      axios.get(`${config.api_url}/v2/api/${config.api_path}/products?page=${page}`)
      .then(res => {
        this.productsData = res.data.products
        this.pagination = res.data.pagination
      })
      .catch(error => {
        console.log(error);
      })
    },
    getCartsData() {
      axios.get(`${config.api_url}/v2/api/${config.api_path}/cart`)
      .then(res => {
        this.cartsData = res.data.data
      })
      .catch(error => {
        console.log(error);
      })
    },
    addToCart(id,qty=1) {
      this.isLoading = true
      let obj = {
        data: {
          "product_id": id,
          "qty": qty
        },
      };
      axios.post(`${config.api_url}/v2/api/${config.api_path}/cart`, obj)
      .then(() => {
        this.getCartsData()
        this.isLoading = false
      })
      .catch(error => {
        console.log(error);
      })
    },
    delAllCart() {
      this.isLoading = true
      axios.delete(`${config.api_url}/v2/api/${config.api_path}/carts`)
      .then(() => {
        this.getCartsData()
        this.isLoading = false
      })
      .catch(error => {
        console.log(error);
      })
    },
    delCart(id) {
      this.isLoading = true
      axios.delete(`${config.api_url}/v2/api/${config.api_path}/cart/${id}`)
      .then(() => {
        this.getCartsData()
        this.isLoading = false
      })
      .catch(error => {
        console.log(error);
      })
    },
    changeCartNum(id, productId, num) {
      let obj = {
        "data": {
          "product_id": productId,
          "qty": num
        }
      }
      axios.put(`${config.api_url}/v2/api/${config.api_path}/cart/${id}`,obj)
      .then(() => {
        this.getCartsData()
      })
      .catch(error => {
        console.log(error);
      })
    },
    openModal(id) {
      this.tempProductId = id
      this.$refs.productModal.openModal()
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    onSubmit() {
      let obj = {
        ...this.userInfo
      }
      axios.post(`${config.api_url}/v2/api/${config.api_path}/order`, obj)
      .then(res => {
        alert(res.data.message)
        this.userInfo = {
          "data": {
            "user": {
              "name": "",
              "email": "",
              "tel": "",
              "address": ""
            },
            "message": ""
          }
        },
        this.getCartsData()
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
  mounted() {
    this.getProductsData();
    this.getCartsData()
  },
})

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.mount('#app');