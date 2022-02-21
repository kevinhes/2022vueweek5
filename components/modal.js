import config from "../JS/config.js";

export default {
  data() {
    return {
      modal: '',
      productData: {},
      qty: 1,
    };
  },
  props: ['id'],
  methods: {
    openModal() {
      this.modal.show()
    },
    getProduct() {
      axios.get(`${config.api_url}/v2/api/${config.api_path}/product/${this.id}`)
      .then(res => {
        console.log(res);
        this.productData = res.data.product
      })
      .catch(error => {
        console.log(error);
      })
    },
    addToCart() {
      this.$emit('add-to-cart', this.productData.id,this.qty)
      this.modal.hide()
    }
  },
  watch: {
    id() {
      this.getProduct()
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal)
  },
  template: '#userProductModal',
} 