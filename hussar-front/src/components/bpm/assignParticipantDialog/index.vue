<!--当前此组件无用-->
<template>
  <el-dialog
    v-dialog-drag
    title="选择参与者"
    :visible="assignParticipantDialogVisible"
    class="assignParticipantDialogVisible lcdp-dialog"
    width="800px"
    :modal="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="assignParticipant-content">
      <div class="content-left">
        <div class="selectNode-title">选择节点</div>
        <ul>
          <li v-for="(participantItem, participantIndex) in assignParticipantData" :key="participantIndex">
            <el-tooltip effect="dark" :content="participantItem.name" placement="left" :open-delay="500">
              <div
                :class="{active:activeNodeIndex === participantIndex}"
                @click="changeNode($event, participantItem, participantIndex)"
              >{{ participantItem.name }}</div>
            </el-tooltip>
          </li>
        </ul>
      </div>
      <div class="content-right">
        <el-table
          ref="assignParticipantTable"
          @selection-change="tableSelectChange"
          :data="tableData"
        >
          <el-table-column
            type="selection"
            align="center"
            width="55"
          />
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="50"
          />
          <el-table-column
            prop="userName"
            align="center"
            label="参与者"
          />
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="dialog-cancel" @click="handleClose">取消</el-button>
      <el-button class="dialog-save" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AssignParticipantDialog',
  props: {
    // 弹窗显隐
    assignParticipantDialogVisible: Boolean,
    // 所有参与者数据
    assignParticipantData: Array,
    // 上传保存的数据
    selectionBackup: Array
  },
  data() {
    return {
      // 参与者表格数据
      tableData: [],
      // 当前选中节点信息
      currentNodeData: {},
      // 当前激活节点索引
      activeNodeIndex: 0,
      // 所有表格选中集合
      allTableSelect: [],
      // 是否通过点击节点改变选中数据
      isClickNode: false
    };
  },
  watch: {
    assignParticipantDialogVisible: {
      handler(n) {
        if (n) {
          this.init();
        }
      },
      deep: true
    }
  },
  computed: {
  },
  methods: {
    // 初始化
    init() {
      if (this.assignParticipantData.length > 0) {
        this.allTableSelect = JSON.parse(JSON.stringify(this.selectionBackup));
        this.currentNodeData = JSON.parse(JSON.stringify(this.assignParticipantData[0]));
        this.tableData = JSON.parse(JSON.stringify(this.currentNodeData.assignee));
        setTimeout(this.changeSelectParticipant(), 50);
        this.activeNodeIndex = 0;
      }
    },
    // 取消配置
    handleClose() {
      this.$emit('close');
    },
    // 保存配置
    handleSave() {
      this.$emit('comfirm', {
        allTableSelect: this.allTableSelect
      });
    },
    // 切换节点
    changeNode(ev, item, index) {
      // 阻止事件冒泡
      ev.stopPropagation();

      this.isClickNode = true;
      this.currentNodeData = { ...item };
      this.tableData = [...this.currentNodeData.assignee];
      setTimeout(this.changeSelectParticipant(), 50);
      this.isClickNode = false;
      this.activeNodeIndex = index;
    },
    // 表格选中改变
    tableSelectChange(data) {
      if (!this.isClickNode) {
        let isExist = false;
        for (let i = 0; i < this.allTableSelect.length; i++) {
          if (this.allTableSelect[i][this.currentNodeData.id]) {
            this.allTableSelect[i][this.currentNodeData.id] = [...data];
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          const obj = {};
          obj[this.currentNodeData.id] = data;
          this.allTableSelect.push(obj);
        }
      }
      this.isClickNode = false;
    },
    // 改变当前节点的参与者的选中状态
    changeSelectParticipant() {
      let isExist = false;
      let selectParticipant = [];
      for (let i = 0; i < this.allTableSelect.length; i++) {
        if (this.allTableSelect[i][this.currentNodeData.id]) {
          isExist = true;
          selectParticipant = [...this.allTableSelect[i][this.currentNodeData.id]];
          break;
        }
      }
      this.$nextTick(() => {
        if (isExist && this.$refs.assignParticipantTable) {
          this.tableData.forEach(elem => {
            this.$refs.assignParticipantTable.toggleRowSelection(elem, false);
            selectParticipant.forEach(elem1 => {
              if (elem1.userId === elem.userId) {
                this.$refs.assignParticipantTable.toggleRowSelection(elem, true);
              }
            });
          });
        }
      });
    }
  }
};
</script>

<style scoped>
  .assignParticipantDialogVisible ::v-deep .el-dialog {
    height: 85%;
    max-height: 85%;
  }
  .assignParticipantDialogVisible ::v-deep .el-dialog__body {
    height: calc(100% - 39px - 57px - 1px);
    border-bottom: 1px rgb(226, 226, 226) solid;
    padding: 0;
  }
  .assignParticipantDialogVisible .assignParticipant-content {
    height: 100%;
  }
  .assignParticipantDialogVisible .content-left {
    width: 20%;
    height: 100%;
    border-right: 1px rgb(226, 226, 226) solid;
    float: left;
  }
  .assignParticipantDialogVisible .content-right {
    width: calc(100% - 20% - 1px);
    height: 100%;
    float: left;
  }
  .assignParticipantDialogVisible .content-right .el-table {
    height: 100%;
  }
  .assignParticipantDialogVisible .content-right .el-table::before {
    display: none;
  }
  .assignParticipantDialogVisible .selectNode-title {
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-bottom: 1px rgb(226, 226, 226) solid;
    font-weight: 600;
  }
  .assignParticipantDialogVisible .content-left ul {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
  .assignParticipantDialogVisible .content-left ul > li {
    list-style: none;
  }
  .assignParticipantDialogVisible .content-left ul > li > div {
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .assignParticipantDialogVisible .content-left ul > li > div:hover,
  .assignParticipantDialogVisible .content-left ul > li > div.active {
    background: #e7fcfb;
  }
</style>
