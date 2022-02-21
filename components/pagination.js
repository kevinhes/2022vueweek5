export default {
  template: '#pagination',
  props: ['pagination'],
  methods: {
    pageChange(page) {
      this.$emit('page-change', page)
    },
  },
}