<template>
  <div>
    <page-header-wrapper>
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-row :gutter="48">
              <a-form layout="inline">
                <a-col :md="7" :sm="24">
                  <a-form-item label="字典名称">
                    <a-input v-model="queryParam.name" placeholder="请输入字典名称"/>
                  </a-form-item>
                </a-col>
                <a-col :md="7" :sm="24">
                  <a-form-item label="字典类型">
                    <a-input v-model="queryParam.type" placeholder="请输入字典类型"/>
                  </a-form-item>
                </a-col>
                <a-col :md="7" :sm="24">
                  <a-form-item label="状态">
                    <a-select v-model="queryParam.status" placeholder="请选择状态" default-value="0">
                      <a-select-option value="0">启用</a-select-option>
                      <a-select-option value="1">停用</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="3" :sm="24">
                  <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                </a-col>
              </a-form>
            </a-row>
          </div>

          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="handleAction(1)" v-permisaction="['system:sysdicttype:add']">新建</a-button>
            <a-button type="primary" :disabled="btnGroup.disabledEdit" icon="edit" @click="handleAction(2)" v-permisaction="['system:sysdicttype:edit']">修改</a-button>
            <a-button type="danger" :disabled="btnGroup.disabledDelete" icon="delete" @click="handleAction(3)" v-permisaction="['system:sysdicttype:remove']">删除</a-button>
            <a-button type="dashed" :disabled="btnGroup.disabledExport" icon="export" @click="handleAction(4)" v-permisaction="['system:sysdicttype:export']">导出</a-button>
          </div>

          <Stable
            ref="table"
            size="default"
            rowKey="key"
            :columns="columns"
            :data="loadData"
            :alert="true"
            :rowSelection="rowSelection"
            showPagination="auto">
            <span slot="no" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="dictName" slot-scope="text">
              <a-button type="link">
                {{ text }}
              </a-button>
            </span>
            <span slot="status" slot-scope="text">
              <a-switch checked-children="开" un-checked-children="关" :checked="text === '0'"/>
            </span>
            <span slot="createdAt" slot-scope="text">
              {{ text | dayjs }}
            </span>
            <span slot="updatedAt" slot-scope="text">
              {{ text | dayjs }}
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <span v-permisaction="['system:sysdicttype:query']">
                  <a @click="handleEdit(record,1)">查看</a>
                <a-divider type="vertical" />
                </span>
                <span v-permisaction="['system:sysdicttype:edit']">
                  <a @click="handleEdit(record,2)">修改</a>
                <a-divider type="vertical" />
                </span>
                <span v-permisaction="['system:sysdicttype:remove']">
                   <a @click="handleEdit(record,3)">删除</a>
                <a-divider type="vertical" />
                </span>
                <a @click="handleEdit(record,4)">管理键值</a>
              </template>
            </span>
          </Stable>
        </a-card>
    </page-header-wrapper>

    <Type
      ref="types"
      :visible="showType"
      @cancel="handleTypeCancel"
      @onfirm="handleTypeConfirm">
    </Type>

    <CustomDialog
      :visible="dialog.show"
      :title="dialog.title"
      @cancel="handleCustomDialogCancel"
      @confirm="handleCustomDialogConfirm">
      <template #modal-wrapper>
          23423
      </template>
    </CustomDialog>
  </div>
</template>

<script>
import { listType } from "@/api/system/dict/type"
import Stable from '@/components/Table/index'
import Type from "./type"
import CustomDialog from '@/components/CustomDialog/index'

export default {
  name: 'index',
  components: {
    Stable,
    Type,
    CustomDialog
  },
  data() {
    return {
      dialog: {
        show: false,
        title: ""
      },
      queryParam: {},
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return listType(requestParameters)
          .then(res => {
            return res.data
          })
      },
      btnGroup: {
        disabledEdit: true,
        disabledDelete: true,
        disabledExport: true,
      },
      rowSelection: {
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
          let len = selectedRows.length;
          if ( len === 1) {
            this.btnGroup.disabledEdit = false;
          } else{
            this.btnGroup.disabledEdit = true;
          }

          if(len >=1) {
            this.btnGroup.disabledExport = false;
            this.btnGroup.disabledDelete = false;
          } else {
            this.btnGroup.disabledExport = true;
            this.btnGroup.disabledDelete = true;
          }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          if(!selected) {
            this.btnGroup.disabledExport = true;
            this.btnGroup.disabledDelete = true;
          } else {
            this.btnGroup.disabledEdit = true;
            this.btnGroup.disabledExport = false;
            this.btnGroup.disabledDelete = false;
          }
          console.log(selected, selectedRows, changeRows);
        },
      },
      columns: [
        {
          title: '字典编号',
          align: 'center',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '字典名称',
          align: 'center',
          dataIndex: 'dictName',
          scopedSlots: { customRender: 'dictName' }
        },
        {
          title: '字典类型',
          align: 'center',
          dataIndex: 'dictType'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createdAt',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '修改时间',
          align: 'center',
          dataIndex: 'updatedAt',
          scopedSlots: { customRender: 'updatedAt' }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          width: '220px',
          scopedSlots: { customRender: 'action' }
        },
      ],
      showType: false
    }
  },
  created () {

  },
  methods: {
    handleAction (index) {
      switch (index) {
        case 1:
          this.dialog = {
            show: true,
            title: "新增字典"
          }
          break;
        case 2:
          this.dialog = {
            show: true,
            title: "修改字典"
          }
          break;
        case 3:
          this.$confirm({
            title: '提示',
            content: '确定删除所选项吗?',
            okText: '确认',
            centered:true,
            cancelText: '取消',
          });
          break;
        case 4:

          break;
      }
    },
    handleEdit(e,index) {
      switch (index) {
        case 1:

          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          this.showType = true;
          this.$refs.types.setType(e.dictType)
          break;
      }
    },
    handleTypeCancel() {
      this.showType = false;
    },
    handleTypeConfirm() {

    },
    handleCustomDialogCancel() {
      this.dialog = {
        show: false,
        title: "新增字典"
      }
    },
    handleCustomDialogConfirm() {

    }
  }
}
</script>

<style lang="less" scoped>
  .ant-table-row-cell-break-word{
    a {
      font-size: 13px;
    }
  }
</style>