<template>
  <div>
    <a-drawer
      title="数据字典值列表"
      width="40%"
      destroyOnClose
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
      >
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAction(1)">新建</a-button>
        <a-button type="danger" icon="delete" @click="handleAction(2)">删除</a-button>
      </div>
      <a-table :columns="columns" :data-source="loadData" :row-selection="rowSelection">
          <span slot="dictLabel" slot-scope="text">
            <a-button type="link">
              {{ text }}
            </a-button>
          </span>
          <span slot="status" slot-scope="text">
            <a-switch checked-children="开" un-checked-children="关" :checked="text === '0'"/>
          </span>
          <span slot="action" slot-scope="text, record">
              <template>
                <a @click="handleEdit(record,1)">修改</a>
                <a-divider type="vertical" />
                <a @click="handleEdit(record,2)">删除</a>
              </template>
          </span>
      </a-table>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="onSubmit">
          提交
        </a-button>
      </div>
      </a-drawer>
  </div>
</template>

<script>
import { getDicts } from '@/api/system/dict/data'
export default {
  name: 'type',
  props: {
    visible: Boolean
  },
  data() {
    return {
      typeId: "",
      columns: [
        {
          title: '字典编码',
          align: 'center',
          dataIndex: 'dictCode',
          key: 'dictCode',
        },{
          title: '字典标签',
          align: 'center',
          dataIndex: 'dictLabel',
          key: 'dictLabel',
          scopedSlots: { customRender: 'dictLabel' }
        },{
          title: '字典键值',
          align: 'center',
          dataIndex: 'dictValue',
          key: 'dictValue',
        },{
          title: '字典排序',
          align: 'center',
          dataIndex: 'dictSort',
          key: 'dictSort',
        },{
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },{
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          key: 'remark',
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        },
      ],
      loadData: [],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows);
        },
      }
    }
  },
  methods: {
    onClose() {
      this.$emit("cancel")
    },
    onSubmit() {
      this.$emit("confirm")
    },
    getList () {
      // sys_normal_disable
    },
    setType(dictType) {
      this.typeId = dictType;
      getDicts(dictType).then(res => {
          this.loadData = res.data
      })
    },
    handleEdit(index) {

    },
    handleAction(index) {

    }
  }
}
</script>

<style lang="less" scoped>
.ant-table-tbody{
  a {
    font-size: 13px;
  }
}
</style>