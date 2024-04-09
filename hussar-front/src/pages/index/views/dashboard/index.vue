<template>
  <div class="round">
    <blob-img
      v-if="JSON.stringify(welcomeConf) !== '{}' && welcomeConf.welcomeBg.length && welcomeConf.welcomeBg[0].name"
      :src="'/attachment/showPicture?image=' + welcomeConf.welcomeBg[0].name"
      class="avatar bgImg"
    />
    <div class="list-container business-list-container">
      <el-row :gutter="16">
        <template v-for="(listItem, index) in welcomeConfList">
          <el-col :span="listMaxCol(listItem, index)" :key="index" :class="{'display-no': (listItem.length === 0) && (isFull || listItemHide(index))}">
            <div v-for="(compItem, compIndex) in listItem" :key="compItem.id" class="component-item" :style="{ height: compHeight(compItem.comRow, compIndex, listItem.length) }">
              <global-keep-alive :cache-key="getCacheKey(compItem)">
                <component
                  ref="instance"
                  :v="compItem"
                  :is="compItem.name"
                  :id="compItem.id"
                  :data-key="compItem.id"
                  :class="compItem.comSize"
                  :is-business="true"
                  :show-change-page="compItem.comSize"
                />
              </global-keep-alive>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';
import GlobalKeepAlive from '@/components/compose/GlobalKeepAlive';
import { meetingComp, todoListComp, quickAccessComp, personalizedConfApi } from 'hussar-config';
import { notice } from 'hussar-notice';

import { hussarAxiosRequestUtils, BlobImg } from 'hussar-base';

export default {
  name: 'UserDashboard',
  components: {
    GlobalKeepAlive,
    meetingComp,
    notice,
    todoListComp,
    quickAccessComp,
    BlobImg
  },
  data() {
    return {
      defaultWelcomeConf: {},
      showChangePage: '',
      welcomeBgId: 0,
      welcomeBg: 0
    };
  },
  computed: {
    welcomeConf() {
      return this.$store.getters.welcomeConf;
    },
    welcomeConfList() {
      if (this.welcomeConf && Object.keys(this.welcomeConf).length > 0) {
        const temp = {};
        temp.leftComList1 = this.welcomeConf.leftComList1;
        temp.leftComList2 = this.welcomeConf.leftComList2;
        temp.leftComList3 = this.welcomeConf.leftComList3;
        temp.leftComList4 = this.welcomeConf.leftComList4;
        return temp;
      }
      return this.defaultWelcomeConf;
    },
    // welcomeBg() {
    //   debugger
    //   return '/attachment/showPicture?image=' + this.welcomeConfList.welcomeBg[0].id;
    // },
    isFull() {
      if ((this.list1MaxCol + this.list2MaxCol + this.list3MaxCol + this.list4MaxCol) > 10) {
        return true;
      }
      return false;
    },
    list1MaxCol() {
      if (this.welcomeConfList.leftComList1.length > 0) {
        let maxCol = 0;
        this.welcomeConfList.leftComList1.forEach((item) => {
          if (item.comCol > maxCol) {
            maxCol = _.cloneDeep(item.comCol);
          }
        });
        return maxCol;
      }
      return 0;
    },
    list2MaxCol() {
      if (this.welcomeConfList.leftComList2.length > 0) {
        let maxCol = 0;
        this.welcomeConfList.leftComList2.forEach((item) => {
          if (item.comCol > maxCol) {
            maxCol = _.cloneDeep(item.comCol);
          }
        });
        return maxCol;
      }
      return 0;
    },
    list3MaxCol() {
      if (this.welcomeConfList.leftComList3.length > 0) {
        let maxCol = 0;
        this.welcomeConfList.leftComList3.forEach((item) => {
          if (item.comCol > maxCol) {
            maxCol = _.cloneDeep(item.comCol);
          }
        });
        return maxCol;
      }
      return 0;
    },
    list4MaxCol() {
      if (this.welcomeConfList.leftComList4.length > 0) {
        let maxCol = 0;
        this.welcomeConfList.leftComList4.forEach((item) => {
          if (item.comCol > maxCol) {
            maxCol = _.cloneDeep(item.comCol);
          }
        });
        return maxCol;
      }
      return 0;
    },
    list1IsHide() {
      if ((this.list4MaxCol === 6 && !this.list2MaxCol) || (this.list2MaxCol === 6 && (this.list3MaxCol || this.list4MaxCol))) {
        return true;
      }
      return false;
    },
    list2IsHide() {
      if ((this.list1MaxCol === 6 && !this.list3MaxCol) || (this.list3MaxCol === 6 && (this.list1MaxCol || this.list4MaxCol))) {
        return true;
      }
      return false;
    },
    list3IsHide() {
      if ((this.list2MaxCol === 6 && !this.list4MaxCol) || (this.list4MaxCol === 6 && (this.list1MaxCol || this.list2MaxCol))) {
        return true;
      }
      return false;
    },
    list4IsHide() {
      if ((this.list3MaxCol === 6 && !this.list1MaxCol) || (this.list1MaxCol === 6 && (this.list2MaxCol || this.list3MaxCol))) {
        return true;
      }
      return false;
    }
  },
  methods: {
    listMaxCol(list, listName) {
      let maxCol = 0;
      const index = Number.parseInt(listName.substring(listName.length - 1, listName.length), 10);
      list.forEach((item) => {
        if (item.comCol > maxCol) {
          maxCol = _.cloneDeep(item.comCol);
        }
      });
      if (maxCol === 0) {
        maxCol = 3;
      }
      return maxCol * 2;
    },
    compHeight(comRow, index, listLength) {
      const rate = comRow / 6 * 100;
      if (index === listLength - 1) {
        return `${rate}%`;
      }
      return `calc(${rate}% - 16px)`;
    },
    initWelcomeConf() {
      const self = this;
      if (!self.welcomeConf || Object.keys(self.welcomeConf).length === 0) {
        self.$store.dispatch('GenerateWelcomeConfig');
      }
    },
    listItemHide(listName) {
      const index = Number.parseInt(listName.substring(listName.length - 1, listName.length), 10);
      const computedName = `list${index}IsHide`;
      return this[computedName];
    },
    getCacheKey(compItem) {
      // 面板的组件实例名+主键组成 GlobalKeepAlive 的缓存键值
      return `dashboard:${this._uid}:${compItem.name}:${compItem.id}`;
    },
    removeAllCaches() {
      // 清除所有当前组件创建的缓存
      const cache = GlobalKeepAlive._globalCache;
      const prefix = `dashboard:${this._uid}:`;
      for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
          cache.remove(key);
        }
      }
    }
  },
  created() {
    this.initWelcomeConf();
  },
  destroyed() {
    this.removeAllCaches();
  }
};
</script>

<style>
.list-container .todo-comp {
  width: 100%;
  height: 100%;
}
</style>
<style scoped lang="scss">
.list-container .el-row, .list-container .el-row .el-col {
  height: 100%;
}
.component-item {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 4px;
}
.component-item:last-child {
  margin-bottom: 0;
}
.display-no {
  display: none;
}
.bgImg{
  float: right;
  position: absolute;
  width: 100%;
  height: 100%;
}
.round{
  height: 100%;
}
</style>
