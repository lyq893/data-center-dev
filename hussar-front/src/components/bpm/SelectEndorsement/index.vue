<!--当前此组件无用-->
<template>
  <el-dialog
    v-dialog-drag
    title="选择加签人"
    :visible.sync="selectEndorsementShow"
    class="selectEndorsementVisible lcdp-dialog"
    width="300px"
    :modal="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="roleTree-dialog-body">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-tree
        ref="tree"
        class="roleTree lcdp-tree"
        :props="props"
        node-key="id"
        :load="loadNode"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        lazy
        show-checkbox
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="dialog-cancel" @click="handleClose">取消</el-button>
      <el-button class="dialog-save" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hussarRequest } from 'hussar-base';
import * as HussarRouter from '@/utils/HussarRouter';

export default {
  name: 'SelectEndorsement',
  props: {
    selectEndorsementShow: Boolean,
    endorsementChecked: Array
  },
  data() {
    return {
      // 人员树过滤关键字
      filterText: '',
      // 人员树配置
      props: {
        id: 'id',
        label: 'label',
        children: 'zones',
        isLeaf: 'isLeaf',
        disabled: this.disabledFn
      }
    };
  },
  watch: {
    // 过滤树节点
    filterText: {
      handler(n) {
        this.$refs.tree.filter(n);
      },
      deep: true
    },
    // 过滤树节点
    selectEndorsementShow: {
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
    // 关闭弹窗
    handleClose() {
      this.$emit('close');
    },
    // 保存弹窗
    handleSave() {
      const nodes = this.$refs.tree.getCheckedNodes();
      if (nodes.length > 0) {
        // 获取处理被选中用户id
        const idArr = [];
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].type === 'user') {
            idArr.push(nodes[i].id);
          }
        }
        const ids = idArr.join(',');
        this.$emit('save', {
          endorsementChecked: [...nodes],
          endorsements: ids
        });
      } else {
        HussarRouter.showMsg(this, '请选择加签人', 'warning');
      }
    },
    // 初始化
    init() {
      this.filterText = '';
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes(this.endorsementChecked);
      }
    },
    // 加载树
    loadNode(node, resolve) {
      const self = this;
      let id = 11;
      if (node.level !== 0) {
        id = node.data.id;
      }
      const data = { id: id };
      hussarRequest.get('/assignee/user', data).then((res) => {
        return resolve(res);
      }).catch(() => {
        HussarRouter.showMsg(this, '获取人员树异常', 'error');
      });
    },
    // 渲染树节点
    renderContent(h, { node, data }) {
      let iconType = 'tree-com';
      if (data.type === 'user') {
        iconType = 'tree-staff';
      }
      return (
        <div>
          <span class='staff-tree'>
            <span className='svg-icon'><svg-icon icon-class={iconType}/></span>
            {node.label}
          </span>
        </div>
      );
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>

<style scoped>
  .selectEndorsementVisible ::v-deep .el-dialog__body {
    padding: 5px 20px 15px 20px;
    border-bottom: 1px solid #eeeeee;
  }
  .selectEndorsementVisible, .roleTree-dialog-body {
    width: 100%;
  }
  .selectEndorsementVisible .roleTree {
    width: 100%;
    height: 300px;
    overflow: auto;
    margin-top: 10px;
  }
  .selectEndorsementVisible .roleTree ::v-deep .el-tree-node {
    padding-left: 0;
  }
</style>
