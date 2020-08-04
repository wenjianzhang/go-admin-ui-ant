<template>
  <div>
    <a-modal
      v-dialog-drag
      v-model="visible"
      :maskClosable="false"
      centered
      :closable="false"
      @cancel="handleCancel"
      :title="title">
      <slot name="modal-wrapper"></slot>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "CustomDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String
  },
  methods: {
    handleCancel() {
      this.$emit("cancel")
    },
    handleOk() {
      this.$emit("canform")
    }
  }
}
</script>

<style lang="less" scoped>

</style>