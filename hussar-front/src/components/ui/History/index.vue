<template>
  <div class="list-container common-config">
    <div class="config-container layout-config">
      <div class="config-title">
        升级日志
      </div>
      <div id="history" class="history">
        <div class="title-position center">三分钟<span class="title-color">了解轻骑兵低代码开发平台演变史</span></div>
        <div class="timeline" style="margin-right: 15px">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in list1" :key="index" class="timeline-item__wrapper timeline-item__icon" placement="top" icon="el-icon-caret-bottom" :size="item.size" :class="index==current1 ? 'show-border' : 'hide-border'">
              <span class="title-size">{{ item.times }}</span>
              <div class="div1 updata-title " :class="index==current1 ? 'active1' : 'div1'">
                {{ item.version }}
                <p class="updata-time">{{ item.time }}</p>
              </div>
              <div class="arrow" />
              <div class="arrow-border" />
              <el-card class="el-card__body" :class="index==current ? 'active2' : 'el-card__body'" v-if="item.borderHide">
                <el-collapse class="lcdp-collapse" v-model="active1" accordion @change="clickItem(index,1)">
                  <el-collapse-item>
                    <template slot="title">
                      <h3 class="timeline-title">
                        {{ item.title1 }}<span class="title-color">{{ item.version }}</span>{{ item.title2 }}
                      </h3>
                    </template>
                    <div class="updata-info-con clearfix">
                      <ul>
                        <li v-for="(descItem,i) in item.desc" :key="i">{{ descItem }}</li>
                      </ul>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in list2" :key="index" class="timeline-item__wrapper timeline-item__icon" placement="top" icon="el-icon-caret-bottom" :size="item.size" :class="index==current2 ? 'show-border' : 'hide-border'">
              <span class="title-size">{{ item.times }}</span>
              <div class="div1 updata-title " :class="index==current2 ? 'active1' : 'div1'">
                {{ item.version }}
                <p class="updata-time">{{ item.time }}</p>
              </div>
              <div class="arrow" />
              <div class="arrow-border" />
              <el-card class="el-card__body" :class="index==current2 ? 'active2' : 'el-card__body'" v-if="item.borderHide">
                <el-collapse class="lcdp-collapse" v-model="active2" accordion @change="clickItem(index,2)">
                  <el-collapse-item>
                    <template slot="title">
                      <h3 class="timeline-title">
                        {{ item.title1 }}<span class="title-color">{{ item.version }}</span>{{ item.title2 }}
                      </h3>
                    </template>
                    <div class="updata-info-con clearfix">
                      <ul>
                        <li v-for="(descItem,i) in item.desc" :key="i">{{ descItem }}</li>
                      </ul>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in list3" :key="index" class="timeline-item__wrapper timeline-item__icon" placement="top" icon="el-icon-caret-bottom" :size="item.size" :class="index==current3 ? 'show-border' : 'hide-border'">
              <span class="title-size">{{ item.times }}</span>
              <div class="div1 updata-title " :class="index==current3 ? 'active1' : 'div1'">
                {{ item.version }}
                <p class="updata-time">{{ item.time }}</p>
              </div>
              <div class="arrow" />
              <div class="arrow-border" />
              <el-card class="el-card__body" :class="index==current3 ? 'active2' : 'el-card__body'" v-if="item.borderHide">
                <el-collapse class="lcdp-collapse" v-model="active3" accordion @change="clickItem(index,3)">
                  <el-collapse-item>
                    <template slot="title">
                      <h3 class="timeline-title">
                        {{ item.title1 }}<span class="title-color">{{ item.version }}</span>{{ item.title2 }}
                      </h3>
                    </template>
                    <div class="updata-info-con clearfix">
                      <ul>
                        <li v-for="(descItem,i) in item.desc" :key="i">{{ descItem }}</li>
                      </ul>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in list4" :key="index" class="timeline-item__wrapper timeline-item__icon" placement="top" icon="el-icon-caret-bottom" :size="item.size" :class="index==current4 ? 'show-border' : 'hide-border'">
              <span class="title-size">{{ item.times }}</span>
              <div class="div1 updata-title " :class="index==current4 ? 'active1' : 'div1'">
                {{ item.version }}
                <p class="updata-time">{{ item.time }}</p>
              </div>
              <div class="arrow" />
              <div class="arrow-border" />
              <el-card class="el-card__body" :class="index==current4 ? 'active2' : 'el-card__body'" v-if="item.borderHide">
                <el-collapse class="lcdp-collapse" v-model="active4" accordion @change="clickItem(index,4)">
                  <el-collapse-item>
                    <template slot="title">
                      <h3 class="timeline-title">
                        {{ item.title1 }}<span class="title-color">{{ item.version }}</span>{{ item.title2 }}
                      </h3>
                    </template>
                    <div class="updata-info-con clearfix" style="display: block">
                      <ul>
                        <li v-for="(descItem,i) in item.desc" :key="i">{{ descItem }}</li>
                      </ul>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import Fuse from 'fuse.js/dist/fuse.min.js'
// import path from 'path'
// import { generateTitle } from 'BaseCore';

export default {
  name: 'HeaderSearch',
  data() {
    return {
      current: 0,
      current1: 0,
      current2: 0,
      current3: 0,
      current4: 0,
      active1: '',
      active2: '',
      active3: '',
      active4: '',
      list1: [
        {
          size: 'large',
          times: '2021'
        },
        {
          id: 'latest',
          borderHide: 'true',
          version: 'V8.2.0.18',
          time: '07-30',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧Web端增加抽屉组件，移动端增加Tab页、步骤条、下拉框、折叠面板、选人等组件，丰富组件类型。',
            '2)天斧完成10余项功能优化，提升平台易用性。',
            '3)Base平台以及工作流平台UI全面升级，提升用户体验。',
            '4)Base平台增加对登录页、框架页、欢迎页、快捷入口的个性化配置，满足不同用户需求。',
            '5)Base平台修复运维缺陷2个。',
            '6)平台首页增加帮助中心，方便用户查阅。',
            '7)其他功能优化。'
          ]
        },
        {
          id: '40',
          borderHide: 'true',
          version: 'V8.2.0.17',
          time: '06-11',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧UI优化，提升用户体验。',
            '2)工作流平台bug修复。',
            '3)其他功能优化。'
          ]
        },
        {
          id: '39',
          borderHide: 'true',
          version: 'V8.2.0.16',
          time: '05-31',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧UI优化，提升用户体验。',
            '2)天斧数据模型增加字典快速绑定，提升产品易用性。',
            '3)天斧移动端增加15个Echarts图表组件，实现图表类数据可视化展示。',
            '4)天斧移动端引入工作流，实现流程设计。',
            '5)天斧完成50余项功能优化，提升整体稳定性',
            '6)工作流支持子流程驳回操作',
            '7)工作流增加自由驳回和列表启动流程动作。',
            '8)工作流增加流程数据统计。',
            '9)平台配置文件中的配置项实现页面可视化调整。',
            '10)平台统一门户与开发运维分离，方便业务人员使用。',
            '11)其他功能优化。'
          ]
        },
        {
          id: '38',
          borderHide: 'true',
          version: 'V8.2.0.15',
          time: '05-14',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧UI优化，提升用户体验。',
            '2)天斧增加页面级组件，可支持复杂页面的协同开发。',
            '3)天斧完成30余项功能优化，提升整体稳定性。',
            '4)Base平台菜单调整，提升易用性。',
            '5)Base平台支持嵌入式TongWeb。',
            '6)其他功能优化。'
          ]
        },

        {
          id: '37',
          version: 'V8.2.0.14',
          time: '04-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧UI全面升级，提升用户体验。',
            '2)天斧数据模型支持丰富的数据源接入，满足不同场景下的用户需求。',
            '3)天斧移动端优化，提升产品易用性。',
            '4)Base平台多租户与工作流平台多租户集成，便于租户统一管理。',
            '5)工作流平台支持任务超时自动处理等功能。',
            '6)工作流平台优化@全体成员示，便于用户解决问题。',
            '7)其他功能优化，提升平台稳定性、易用性。'
          ]
        },
        {
          id: '36',
          version: 'V8.2.0.13',
          time: '04-15',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)Base平台增加SQL兼容改造，统一SQL为大写，适配数据库对SQL大小写敏感的场景。',
            '2)Base平台BussinessLog功能优化，对于业务修改逻辑，可自定义日志记录内容。',
            '3)Base平台删除hussar-skins相关依赖，统一使用前后分离模式，后台启动不在加载静态资源。',
            '4)Base平台其他功能优化。'
          ]
        },
        {
          id: '35',
          version: 'V8.2.0.12',
          time: '03-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)Base平台增加数据权限功能，可针对用户或者角色进行灵活的数据权限配置。',
            '2)Base平台增加系统监控功能，可对服务器性能指标进行实时监控。',
            '3)Base平台增加任务调度分组管理功能，便于分布式部署时在不同服务器执行不同任务。',
            '4)Base平台增加菜单搜索功能，通过模糊匹配查询可以快速定位到菜单。',
            '5)Base平台底层组件升级，升级SpringBoot版本至2.2.13，升级element-ui版本至2.15.1。'
          ]
        },
        {
          id: '34',
          version: 'V8.2.0.11',
          time: '03-19',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧增加4个Echarts图表组件，可基于天斧实现图表类数据可视化展示。',
            '2)天斧增加2个注释组件，便于团队沟通交流。',
            '3)天斧完成100余项功能优化，提升整体稳定性。',
            '4)Base平台支持一人多组织机构，满足多种项目需求。',
            '5)Base平台支持多租户管理，可根据租户进行数据隔离。',
            '6)Base平台以及工作流平台支持国际化，满足不同语言用户的使用需求。',
            '7)工作流流程调整支持自动生效。',
            '8)工作流参与者配置支持自定义函数功能。',
            '9)工作流驳回、追加节点等功能优化，满足中国式流程需求。',
            '10)其他功能优化，提升平台稳定性、易用性。'
          ]
        },
        {
          id: '33',
          version: 'V8.2.0.10',
          time: '02-03',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧增加9个图表组件，丰富组件类型。',
            '2)天斧适配Oracle、神通数据库，满足多种项目需求。',
            '3)天斧完成50余项功能优化，提升整体稳定性。',
            '4)Base平台安全功能以及中间件优化，满足安全测试要求。',
            '5)移动端微应用管理适配Oracle、SqlServe、达梦、金仓、神通、瀚高数据库，满足多种项目需求。',
            '6)工作流适配Oracle、神通数据库，满足多种项目需求。',
            '7)工作流驳回、追加节点、流程图展示等功能优化，满足用户需求。',
            '8)其他功能优化。'
          ]
        },
        {
          id: '32',
          version: 'V8.2.0.9',
          time: '01-15',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧增加32个组合组件，丰富组件类型。',
            '2)天斧增加自定义组件、自定义模板上传缩略图功能，提升产品易用性。',
            '3)天斧完成63项功能优化，提升整体稳定性。',
            '4)Base平台完善安全审计功能，满足安全测试要求。',
            '5)Base平台集成Lodop打印控件，满足用户需求。',
            '6)Base平台支持移动端微应用管理。',
            '7)工作流支持弹窗场景。',
            '8)工作流参与者、转办、子流程等功能的优化，提升用户体验。',
            '9)其他功能优化。'
          ]
        }
      ],
      list2: [
        {
          size: 'large',
          times: '2020'
        },
        {
          id: '31',
          version: 'V8.2.0.8',
          time: '12-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)优化授权功能。'
          ]
        },
        {
          id: '30',
          version: 'V8.2.0.7',
          time: '12-23',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)对天斧组件功能进行优化。'
          ]
        },
        {
          id: '29',
          version: 'V8.2.0.6',
          time: '12-15',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧新版UI升级，包括页面布局调整、适配1366*768分辨率等，提升显示清晰度。',
            '2)天斧增加表单、表格、详情页等内置模板，提升产品易用性。',
            '3)天斧增加树形表格、多文件上传、数据选择等组件，丰富组件类型。',
            '4)天斧增加组件大纲功能，优化组件选择方式。',
            '5)天斧增加excel导入导出、数据批量新增等功能。',
            '6)天斧完成48项功能优化，提升整体稳定性。'
          ]
        },
        {
          id: '28',
          version: 'V8.2.0.5',
          time: '11-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)Base平台增加组织机构、人员等树的懒加载机制，提升大数据量下的用户体验。',
            '2)Base平台弹窗优化，提高平台美感。',
            '3)Base平台Tab页刷新机制优化，满足多场景下的用户需求。',
            '4)天斧增加自定义组合组件、页面模板、智能推测等功能，提升用户体验。',
            '5)天斧增加多选组件、滚动区域等组件，满足多种功能需求。',
            '6)天斧完成170余项功能优化，提高整体稳定性。',
            '7)工作流增加委托组件、流程自动验证、列表中流程操作等功能，完善业务流程。',
            '8)工作流系统办理意见、会签节点等功能优化，提升用户体验。',
            '9)其他功能优化。'
          ]
        },
        {
          id: '27',
          version: 'V8.2.0.4',
          time: '11-13',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)大数据量的情况下，平台部分树不是懒加载，加载比较慢，影响体验（组织机构树、资源树、人员树）。',
            '2)工作流任务创建以及办理时进行数据推送。'
          ]
        },
        {
          id: '26',
          version: 'V8.2.0.3',
          time: '11-06',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)数据字典支持自定义字典。',
            '2)弹出框中左侧的树展开后，显示不全，建议调整左侧树区域的宽度，调整为整个弹出框的30%。',
            '3)菜单中的选择资源的地方，通过input框打开选择资源树，比较好的体验应该是点击后先打开弹窗，然后loading等待树形加载完。现在的逻辑是树加载完才显示弹窗，比较慢的时候，影响体验。类似这样的地方都需要考虑一下。',
            '4)Tab页需要修改为切换不刷新（在前端加入配置，可控制是否刷新）。'
          ]
        },
        {
          id: '25',
          version: 'V8.2.0.2',
          time: '10-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)Base平台功能优化。',
            '2)工作流配合组织机构进行权限控制。',
            '3)工作流提供移动端流程图显示组件。',
            '4)工作流人员树支持一人多组织机构（仅限对接轻骑兵Base平台）。',
            '5)工作流平台对移动端的事件进行支持。',
            '6)工作流支持任务转办功能。',
            '7)工作流平台支持向三方系统推送待办。',
            '8)工作流支持指定办理人员。',
            '9)工作流对接轻骑兵Base平台的人员查询安全机制。',
            '10)天斧功能优化。'
          ]
        },
        {
          id: '24',
          version: 'V8.2.0.1',
          time: '10-10',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧bug修复。',
            '2)Base平台时间戳修改。'
          ]
        },
        {
          id: '23',
          version: 'V8.2.0.0',
          time: '09-25',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)天斧全新改版，提升用户体验及美观度，完成280余项功能升级。',
            '2)天斧支持拖拽Vue页面，生成的应用可支持前后端分离部署。',
            '3)天斧优化数据模型功能，支持多表关联(一对一、一对多)。',
            '4)天斧支持H5移动应用开发，具备移动应用开发能力。',
            '5)Base平台全面适配国产化环境（服务器、操作系统、中间件、数据库等），与12家国产化软硬件厂商的产品完成兼容适配。',
            '6)Base平台Vue版支持单点登录功能。',
            '7)工作流平台与天斧完全打通，使用更加方便。',
            '8)工作流平台进行样式调整及细节美化，提升系统美观度及用户体验。'
          ]
        },
        {
          id: '22',
          version: 'V8.1.9.5',
          time: '08-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)新增权限数据推送接口，推送组织机构修改数据至工作流平台。',
            '2)授权逻辑调整，同一服务器可对不同项目进行分别授权。',
            '3)授权申请页面修改，增加售前支持联系方式。',
            '4)升级Spring Boot、Apache Shiro、FastJson、Jackson-databind等组件至最新安全版本。'
          ]
        },
        {
          id: '21',
          version: 'V8.1.9.4',
          time: '06-28',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)升级Spring-Boot至2.1.15.RELEASE版本，修复已知功能缺陷及安全问题。',
            '2)升级MyBatis-Plus至3.3.2版本，增加敏感数据存储加密功能及其他新特性升级，应对等保三级安全测评。',
            '3)修改安全相关配置，增加内容安全策略及响应头信息配置。',
            '4)升级FastJson到最新安全版本1.2.72，补充安全黑名单及其他新特性升级。',
            '5)完善开发授权、打包授权逻辑，增强对苹果电脑的适配。'
          ]
        },
        {
          id: '20',
          version: 'V8.1.9.3',
          time: '06-06',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)前后分离安全测试问题改造，涉及身份鉴别、加密传输等。',
            '2)优化授权逻辑，增加前后分离版本未授权提醒。',
            '3)增加devtools配置，开发过程项目代码可热更新。',
            '4)升级FastJson到最新安全版本1.2.70，解决反序列化远程代码执行漏洞的问题。',
            '5)升级Shiro到最新安全版本 1.5.3，提高系统安全性。'
          ]
        },
        {
          id: '19',
          version: 'V8.1.9.2',
          time: '04-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)支持前后分离模式，通过配置可自由切换常规模式或者前后分离模式。',
            '2)深度集成CAS，实现服务端统一身份管理及客户端统一认证登录。',
            '3)集成RabbitMQ消息服务，实现服务间消息通信。',
            '4)优化登录逻辑，最大会话数限制逻辑排除记住登录状态的用户。',
            '5)优化加密传输逻辑，加密传输统一采用国密加密算法。',
            '6)新增组织机构、用户、角色、资源的分级授权功能，满足大型企业分级授权需求。',
            '7)优化部分查询逻辑，提升用户体验。',
            '8)新增授权到期预提醒功能，授权将要到期时，访问授权页面给予提示再次授权。',
            '9)新增基础权限数据导出导入功能，方便多环境部署情况下差异化数据的迁移。',
            '10)升级Shiro到最新安全版本 1.5.1，cookie新增SameSite属性，处理新版浏览器提示跨域问题。'
          ]
        }
      ],
      list3: [
        {
          size: 'large',
          times: '2019'
        },
        {
          id: '18',
          version: 'V8.1.9.1',
          time: '12-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '【一、基础功能升级改造】',
            '1)欢迎页UI升级改造，增加轻骑兵V8平台相关介绍，通过欢迎页可快速了解轻骑兵V8开发平台。',
            '2)组织机构用户树优化，增加懒加载机制，优化数据量大时组织机构用户树加载慢的问题。',
            '3)内置LayUI官方示例代码，把LayUI官方最新示例代码集成到轻骑兵V8平台中，在轻骑兵V8平台内即可方便快捷的学习LayUI。',
            '【二、科研成果吸收转化】',
            '1)集成CAS客户端组件（科研成果复用），轻骑兵V8平台通过简便配置即可集成到现有CAS服务端实现单点登录功能。',
            '2)集成微信开发接口集成组件（科研成果复用）。',
            '3)升级国密算法组件（科研成果复用）。',
            '4)内置开源报表解决方案（科研成果复用）。'
          ]
        },
        {
          id: '17',
          version: 'V8.1.9.0',
          time: '11-28',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)轻骑兵授权逻辑调整，增加开发授权、打包授权，使项目授权模式更加灵活。',
            '2)升级Shiro到最新安全版本 1.4.2，修复cookie持久化参数rememberMe加密算法存在漏洞。',
            '3)代码生成器功能优化，生成代码同时生成资源、菜单及相应SQL语句，减少开发过程重复配置资源的工作。',
            '4)代码重构，优化代码逻辑。'
          ]
        },
        {
          id: '16',
          version: 'V8.1.8.0',
          time: '10-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)代码重构，优化代码逻辑。',
            '2)修复渗透测试问题。',
            '3)集成UReport2报表工具。',
            '4)layui升级到最新的2.5.5版本，多处核心代码优化'
          ]
        },
        {
          id: '15',
          version: 'V8.1.7.5',
          time: '09-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)增强xss、csrf过滤器，修复渗透测试中遇到的问题。',
            '2)升级fastjson版本至1.2.61，修复fastjson处理逻辑缺陷导致的远程拒绝服务漏洞。',
            '3)升级shiro、shiro-redis版本，增加对redis集群的支持。',
            '4)升级springboot版本为2.1.8。'
          ]
        },
        {
          id: '14',
          version: 'V8.1.7.0',
          time: '08-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '【V8平台】',
            '本次升级主要改造内容为安全测评涉及到的安全功能，具体改造内容如下：',
            '1)用户登录、重鉴别，增加TOTP动态口令验证。',
            '2)新增国密算法组件，使用国密算法对数据传输完整性、保密性、有效性校验。',
            '3)新增邮件组件，根据安全测评标准要求，部分功能通过邮件发送相应内容。',
            '4)安全测评标准要求，根据增加配置管理员角色。',
            'r5)根据安全测评标准要求，调整访问控制策略。',
            '6)根据安全测评标准要求，调整审计日志记录内容。',
            '7)配置文件中数据库连接信息加密。',
            '【天斧】',
            '天斧演示版本发布。在1.7.0版本的V8平台中集成天斧功能，天斧是一款基于拖拽方式的可视化快速开发工具，可降低开发门槛，大幅提高开发效率，此次发布的为演示版，具备完成单表增删改查、多表查询列表、表单与流程绑定等功能，后续会逐步发布试用版本。'

          ]
        },
        {
          id: '13',
          version: 'V8.1.6.5',
          time: '07-15',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1) 数据库连接信息支持加密配置。',
            '2) 优化数据字典，仅保留系统字典必需字典项。',
            '3) 修复Weblogic 12c 下的兼容问题。',
            '4) 处理项目启动时提示log4j警告的问题。',
            '5) 其他功能优化。'
          ]
        },
        {
          id: '12',
          version: 'V8.1.6.0',
          time: '05-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)SpringBoot版本重大升级，平台SpringBoot版本由1.5.10升级到2.1.5，兼容更多高版本的三方类库。',
            '2) 修复删除人员时校验关联已删除用户的逻辑。',
            '3) 修复密码复杂度配置未能生效的问题。',
            '4) 修复由于开启会话限制而导致出现404的问题。',
            '5) 进一步优化工作流模块流程图的展示。',
            '6) 其他功能优化。'
          ]
        },
        {
          id: '11',
          version: 'V8.1.5.8',
          time: '05-06',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1) 修复HussarAjax请求登录超时不退出的问题。',
            '2) 新增功能：用户限制被踢出后登录页面提示信息显示。',
            '3) 修复会话超时bootstap-table刷新不跳转登录页面的问题。',
            '4) 升级shiro、shiro-redis版本，增加对redis集群的支持。',
            '5) 升级fastjson版本至1.2.60，修复fastjson处理逻辑缺陷导致的远程拒绝服务漏洞。',
            '6) 其他功能优化。'
          ]
        },
        {
          id: '10',
          version: 'V8.1.5.5',
          time: '03-29',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1) 将平台功能进一步按模块化拆分，项目组可按需依赖所需的模块。',
            '2) 提供报表解决方案，有报表需求的项目组可联系研发中心平台组。',
            '3) 优化工作流模块流程图的展示方式，展示速度更快、更加美观。',
            '4) layui升级到最新的2.4.5版本，修复了下拉框选中空值的问题。',
            '5) 修改平台授权逻辑，可快速提供试用版本供客户试用。',
            '6) 其他功能优化。'
          ]
        },
        {
          id: '9',
          version: 'V8.1.5.0',
          time: '02-28',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '【平台功能优化】：',
            '1) 增加平台编码规则、字典、菜单等资源的导入导出功能。',
            '2) 增加组织机构视图接口，方便进行组织机构信息查询。',
            '3) 增加账号解锁菜单，方便解锁账户。',
            '4) 增加zTree组件并新增zTree使用示例。',
            '5) 支持人员用户同步操作功能，创建人员时可同步创建用户。',
            '6) 支持人员用户1V1维护。',
            '7) 优化工作日历功能，新增事件备注，支持事件维护和查看权限分离。',
            '8) 优化代码生成器页面模板，简化代码结构。',
            '9) 优化访问多个V8项目出现的登陆失效问题。',
            '10) 其他功能优化。',
            '【工作流功能优化】：',
            '1) 新增委托管理。',
            '2) 其他功能优化。'
          ]
        },
        {
          id: '8',
          version: 'V8.1.4.5',
          time: '01-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '【平台功能优化】：',
            '1) 新增角色及角色分组的排序功能。',
            '2) 优化权限相关树的加载方式，可自由配置懒加载或全量加载。',
            '3) 新增菜单打开方式，支持折叠左侧打开。',
            '4) 封装分页列表查询与返回结果，简化代码编写。',
            '5) 提供组织机构拓展方案，满足项目组的个性化需求。',
            '6) 优化用户密码相关功能，提高平台安全性。',
            '7) 新增密码复杂度配置规则，可自由配置密码长度、复杂度等。',
            '8) 优化数据字典接口，返回多种数据结构',
            '9) 新增表单验证方案。',
            '10) 新增BootStrap Table文档，方便开发人员查阅。',
            '11) 优化附件下载接口。',
            '12) 优化标签页切换逻辑。',
            '13) 其他功能优化。',
            '【工作流功能优化】：',
            '1) 新增任务监听器。',
            '2) 新增流程组件（边界定时事件）。',
            '3) 其他功能优化。'
          ]
        }
      ],
      list4: [
        {
          size: 'large',
          times: '2018'
        },
        {
          id: '7',
          version: 'V8.1.4.0',
          time: '12-28',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '【平台功能优化】：',
            '1) 简化配置文件，部分配置项采用默认配置。',
            '2) 兼容金仓数据库，进一步支持国产化部署。',
            '3) 优化登录逻辑，可自由配置登陆账号是否区分大小写。',
            '4) 新增平台组件（多选下拉框组件、级联下拉框组件）。',
            '5) 优化菜单加载逻辑，提升加载速度。',
            '6) 支持JNDI数据源和JNDI多数据源，方便项目部署运维。',
            '7) 优化定时任务初始化逻辑，提升加载速度。',
            '8) 其他功能优化。',
            '【工作流功能优化】：',
            '1) 优化流程接口(驳回接口、流程待办接口)。',
            '2) 优化互斥网关退回问题。',
            '3) 优化流程图展现样式。',
            '4) 其他功能优化。'
          ]
        },
        {
          id: '6',
          version: 'V8.1.3.5',
          time: '11-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1) BootStrap列表增加拖拽改变列顺序、拖拽调整列宽、Excel导出等功能。',
            '2) 增加操作Tab页的功能（js打开Tab、关闭Tab、关闭刷新等功能）。',
            '3) 编号管理支持日期格式前缀，满足各种个性化编号需求。',
            '4) 默认欢迎页访问路径可自由配置。',
            '5) 新增多种流程参与者的配置方式（人员、角色、部门、指定节点）。',
            '6) 新增根据流程节点信息查询已办、待办。',
            '7) 新增流程办理意见功能，并且可在流程图中展示。',
            '8) 新增获取下一流程节点的功能。',
            '9) 新增指定下一流程节点处理人的功能。',
            '10) 新增流程状态查询的功能（正常提交、退回、驳回）。',
            '11) 完善流程提交、退回等接口的返回值，方便与业务系统进行整合。',
            '12) 其他功能优化。'
          ]
        },
        {
          id: '5',
          version: 'V8.1.3.0',
          time: '10-30',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1) 集成ISC，与国网统一权限系统无缝对接。',
            '2) 增加XSS过滤白名单，满足项目上的不同需求。',
            '3) 增加身份证号码校验、数字转大写、汉字转拼音等工具类。',
            '4) 增加人员信息拓展方案，满足项目对人员信息的个性化需求。',
            '5) 增加角色审核开关，灵活配置权限分配的操作步骤。',
            '6) 增加平台首页，全面了解平台特性与迭代信息。',
            '7) 其他功能优化。'
          ]
        },
        {
          id: '4',
          version: 'V8.1.2.5',
          time: '09-28',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)升级前端组件库，Layui升至2.4.3（最新版）大幅加强table组件，增加了合计行、表格打印、表格导出等功能。',
            '2)增加层级码生成功能，满足各种编号需求。',
            '3)优化组织机构树后台逻辑，提高加载速度。',
            '4)增加组织机构树的查询定位功能，自动定位方便查找。',
            '5)增加组织机构相关接口，轻松获取组织机构数据。',
            '6)增加用户登录统计功能。',
            '7)增加角色用户、资源角色的逆向维护功能，提高权限维护速度。',
            '8)增加慢SQL诊断功能，自动抓取超过执行时间阀值的SQL，极大的方便开发、运维人员进行SQL优化。',
            '9)其他一些功能优化。'
          ]
        },
        {
          id: '3',
          version: 'V8.1.2.0',
          time: '08-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)优化用户登录验证逻辑，登录速度更快。',
            '2)增加多数据源功能，多种数据库任意对接。',
            '3)支持任意层级菜单展示。',
            '4)增加系统日志在线下载功能，系统运维更加便捷。',
            '5)增加登陆验证码功能，满足各种登陆需求。',
            '6)增加静态文件全局版本号，升级之后再也不用清理浏览器缓存了。',
            '7)其他一些功能优化。'
          ]
        },
        {
          id: '2',
          version: 'V8.1.1.0',
          time: '07-31',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '1)增加shiro通用配置。',
            '2)增加单机/集群切换开关，适应开发和部署环境。',
            '3)增加换肤功能，适配不同项目主题。',
            '4)优化传输加密逻辑，数据传输更安全。',
            '5)兼容达梦数据库，支持国产化开发。'
          ]
        },
        {
          id: '1',
          version: 'V8.1.0.0',
          time: '06-29',
          borderHide: 'true',
          title1: '轻骑兵低代码开发平台',
          title2: '发布啦!',
          desc: [
            '轻骑兵V8开发平台正式发布，平台采用主流开源框架搭建，集成高安全性的权限管理模块，参照等保二级安全检查标准符合其8个大项126个小项；采用Redis高速缓存，支持集群部署；采用高速模板渲染引擎，页面秒开毫无压力。'
          ]
        }
      ]
    };
  },
  computed: {

  },
  watch: {

  },
  methods: {
    clickItem(index, j) {
      if (j === 1) {
        this.active2 = '';
        this.active3 = '';
        this.active4 = '';
        this.$nextTick(() => {
          this.current2 = 0;
          this.current3 = 0;
          this.current4 = 0;
          this.current1 = index;
        });
      } else if (j === 2) {
        this.active1 = '';
        this.active3 = '';
        this.active4 = '';
        this.$nextTick(() => {
          this.current1 = 0;
          this.current3 = 0;
          this.current4 = 0;
          this.current2 = index;
        });
      } else if (j === 3) {
        this.active2 = '';
        this.active1 = '';
        this.active4 = '';
        this.$nextTick(() => {
          this.current1 = 0;
          this.current2 = 0;
          this.current4 = 0;
          this.current3 = index;
        });
      } else {
        // this.list4.forEach((item,i) => {
        //     if (index !== i) {
        //         item.id = '';
        //     }
        // })
        this.active2 = '';
        this.active3 = '';
        this.active1 = '';
        this.$nextTick(() => {
          this.current1 = 0;
          this.current2 = 0;
          this.current3 = 0;
          this.current4 = index;
        });
      }
    }
  }
};
</script>

<style lang="css" scoped>
  .close {
    position: relative;
    width: 40px;
    height: 40px;
  }

  .close::before,
  .close::after {
    position: absolute;
    content: ' ';
    background-color: red;
    left: 20px;
    width: 1px;
    height: 40px;
  }

  .close::before {
    transform: rotate(45deg);
  }

  .close::after {
    transform: rotate(-45deg);
  }

  .line {
    display: flex;
  }

  .line-item1 {
    flex: 1;
    margin: 10px;
    background: #ffffff;
    padding: 5px 20px;
  }

  ul.el-timeline {
    margin-left: 70px;
    margin-top: 40px;
    margin-bottom: 20px;
    margin-outside: 20px;
  }

  .line-item2 {
    flex: 1;
  }

  .line-item3 {
    flex: 1;
    margin: 5px
  }

  .el-row {
    font-size: 14px;
  }

  .el-col {
    padding-right: 15px;
    padding-left: 15px;
    flex: 1;
  }

  .grid-content {
    min-height: 450px;
  }

  /*.bg-purple {*/
  /*  background: #FCFDFA;*/
  /*}*/

  .version {
    min-height: 95px
  }

  .version-item {
    margin-bottom: 10px
  }

  /* 标题 */
  .item-title {
    width: 80%;
    height: 40px;
    line-height: 40px;
    margin-bottom: 15px;
    margin-top: -5px;
    display: inline-block;
  }

  /*font-weight字体粗细*/
  .title-text {
    font-weight: bold;
    font-size: 16px;
    display: inline-block;
    color: #666;
  }

  .title-line {
    height: 1px;
    display: inline-block;
    vertical-align: middle;
  }

  .title-icon {
    width: 20px;
    height: 20px;
    text-indent: 23px;
    display: inline-block;
    line-height: 20px;
    color: #045340;
  }

  /* 长度 */
  .line-length1 {
    width: calc(100% - 220px);
  }

  .line-length2 {
    width: calc(100% - 200px);
  }

  .line-length3 {
    width: calc(100% - 200px);
  }

  .line-length4 {
    width: calc(100% - 228px);
  }

  .line-length5 {
    width: calc(100% - 406px);
  }

  .line-length6 {
    width: calc(100% - 190px);
  }

  .line-length7 {
    width: calc(100% - 98px);
  }

  .line-length8 {
    width: calc(100% - 70px);
  }

  .color2 {
    color: #ffcf0b;
  }

  .bgcolor2 {
    background: #ffcf0b;
  }

  .color13 {
    color: #5b93d3;
  }

  .color4 {
    color: #ff7a7c;
  }

  .bgcolor4 {
    background: #ff7a7c;
  }

  .color5 {
    color: #ff9772;
  }

  .bgcolor5 {
    background: #ff9772;
  }

  .color6 {
    color: #ffaf74;
  }

  .bgcolor6 {
    background: #ffaf74;
  }

  .color7 {
    color: #d793e7;
  }

  .bgcolor7 {
    background: #d793e7;
  }

  .color8 {
    color: #a395e7;
  }

  .bgcolor8 {
    background: #a395e7;
  }

  .color9 {
    color: #f05250;
  }

  .bgcolor9 {
    background: #f05250;
  }

  .bgcolor10 {
    background: #ffcd00;
  }

  /* 模块一 */
  .item-context {
    margin-bottom: 10px;
  }

  .qa-item {
    margin-bottom: 20px;
  }

  .sub-title {
    font-size: 14px;
    font-weight: bold;
    color: #666;
    /*height: 35px;*/
  }

  .question-text {
    display: inline-block;
    padding-left: 10px;
  }

  .answer-text {
    padding: 10px 20px;
  }

  /* 模块2 */
  .item2-title {
    width: 100%;
    height: 30px;
    font-size: 18px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 10px;
  }

  .complete-trangele {
    min-width: 584px;
  }

  .triangle-line {
    display: inline-block;
    width: 100%;
  }

  .triangle-asideText {
    display: inline-block;
    border-bottom: 2px dotted #ffcf0b;
    position: relative;
    bottom: 6px;
    right: 4px;
    /*min-width: 200px;*/
  }

  .triangle-asideText > p:nth-of-type(1) {
    position: relative;
    right: 12px;
  }

  .triangle-text {
    float: left;
    position: relative;
    color: #fff;
  }

  .position1 {
    top: 45px;
    left: 135px;
  }

  .position2 {
    top: 15px;
    left: 108px;
  }

  .position3 {
    top: 15px;
    left: 72px;
  }

  .position4 {
    top: 15px;
    left: 45px;
  }

  .position5 {
    top: 15px;
    left: 24px;
  }

  .length1 {
    width: calc(100% - 218px);
  }

  .length2 {
    width: calc(100% - 245px);
  }

  .length3 {
    width: calc(100% - 271px);
  }

  .length4 {
    width: calc(100% - 297px);
  }

  .length5 {
    width: calc(100% - 326px);
  }

  .el-timeline-item__timestamp.is-top {
    margin-bottom: 8px;
    padding-top: 4px;
    margin-left: -117px;
  }

  /*!* 模块3 *!*/
  .aside-img {
    float: left;
    vertical-align: middle;
    -webkit-writing-mode: vertical-rl;
    writing-mode: vertical-rl;
    height: 40px;
    /*margin-left: -10px;*/
    text-align: center;
  }

  .art-left {
    display: inline-block;
    overflow: hidden;
  }

  .title-center {
    text-align: center;
    width: 100%;
  }

  .bigSize {
    font-size: 16px;
    padding: 0 5px;
  }

  .item-min {
    background: #f9f9f9;
    margin: 5px;
    padding: 10px;
    box-sizing: border-box;
  }

  .min-title {
    display: inline-block;
    padding: 0 5px;
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }

  .square-block {
    display: inline-block;
    border-radius: 5px;
    font-weight: bold;
    padding: 0 5px;
  }

  .min-content {
    padding: 0 5px;
    line-height: 24px;
    margin-top: 10px;
  }

  .splitLine {
    display: inline-block;
    overflow: hidden;
    height: 350px;
    line-height: 350px;
    background: url(~@/assets/img/skin/spitline.png) no-repeat center bottom;
    background-size: 1px 100%;
  }

  .art-right {
    display: inline-block;
    overflow: hidden;
    width: 52%;
  }

  .right-minitem {
    flex: 1;
    margin: 5px;
    color: #fff;
    text-align: center;
  }

  /*模块4*/
  .item-columnContext {
    padding: 0 30px;
  }

  .line-column {
    text-align: center;
    border: 1px solid #f05250;
    border-radius: 5px;
    margin: 10px;
  }

  .column-title {
    padding: 0 10px;
  }

  .column-item {
    margin: 20px;
    border: 1px solid #e4eded;
    border-radius: 5px;
  }

  .column-itemTitle {
    color: #fff;
    height: 40px;
    line-height: 40px;
  }

  .column-itemTitle > div {
    display: inline-block;
  }

  .column-itemContent {
    background: #fbfbfb;
    text-align: left;
  }

  .first-class > li {
    text-indent: 1.5em;
    line-height: 30px;
  }

  li {
    list-style: none;
      padding-bottom: 3px;
      padding-top: 3px;
  }

  .second-class > li {
    font-weight: normal;
    text-indent: 3em;
  }

  .column-length1 {
    height: calc(100% - 22px);
  }

  .column-length2 {
    height: calc(50% - 17px);
  }

  .column-length4 {
    height: calc(100% - 22px);
  }

  .mode-item {
    background-color: #E9F9F7;
  }

  .mode-item-msg {
    background: rgba(241, 253, 252, 1);
    border: 1px solid rgba(226, 234, 234, 1);
    padding: 15px 55px;
    margin-bottom: 12px;
  }

  /*原有页面样式修改*/
  .new-mode-msg {
    margin-top: 20px;
    height: 245px;
  }

  .img {
    border-style: none;
    position: relative;
    top: 4px;
  }

  /*.icon-position {*/
  /*  background: url('~@/assets/img/skin/quotation-mark1.jpg') no-repeat left top,*/
  /*  url('~@/assets/img/skin/quotation-mark2.jpg') no-repeat right bottom;*/
  /*}*/

  .version-title {
    background: #EE944B;
    color: #fff;
    text-align: center;
    line-height: 32px;
    float: left;
    width: 80px;
  }

  .version-info {
    background: #FFF8F3;
    border: 1px solid #EE944B;
    color: #666;
    text-align: center;
    line-height: 30px;
    float: left;
    width: calc(100% - 82px);
  }

  .updata-title {
    position: absolute;
    padding: 4px 10px;
    text-align: right;
    border-radius: 4px;
    line-height: 25px;
    font-weight: bold;
  }

  .timeline-title {
    position: relative;
    color: #4A4C66;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
  }

  .timeline-item {
    cursor: pointer;
  }

  .el-card__body {
    border: 1px solid transparent;
    position: relative;
    margin-top: -40px;
    background: #fff;
    width: 701px;
  }
  .el-card.el-card__body{
      padding: 0;
  }
  .el-card.el-card__body >>> .el-card__body{
      padding: 16px 40px;
  }
  .el-card__body.active2 {border-color: #045340;}
  .timeline {
    margin-left: 45px;
  }

  .timeline-item__wrapper {
    position: relative;
    padding-bottom: 32px;
    top: 20px;
    margin-top: 10px;
  }

  .icon {
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /*箭头*/
  .arrow {
    float: right;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 18px;
    top: -11px;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
  .arrow-border {
      float: right;
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      left: 18px;
      top: -11px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      z-index: 1;
      border-right: 10px solid #fff !important;
  }

  .el-collapse {
    border: 0 solid #ffffff;
  }

  .updata-info-con {
    color: #878787;
    line-height: 24px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    /*display: none*/
  }

  .div1 {
    border: 1px solid transparent;
    margin-left: -130px;
  }

  .link-item {
    width: calc(50% - 77px);
    margin: 5px 20px;
    line-height: 32px;
    padding-left: 35px;
    background-position: left center !important;
    color: #666;
    display: inline-block;
  }

  .nine-item {
    overflow: hidden;
    float: left;
    width: calc(50% - 40px);
    line-height: 45px;
    padding-left: 40px;
    background-repeat: no-repeat;
    background-position: left center;
    color: #666
  }

  @media screen and (max-width: 1600px) {
    .mode-item-msg {
      padding: 15px;
    }

    .nine-item {
      height: 28px;
      margin-bottom: 20px;
      line-height: 26px;
      padding-top: 4px
    }

    .nine-item:last-child {
      margin-bottom: 0;
    }
  }

  /*高分屏*/
  @media screen and (max-width: 2000px)and (min-width: 1612px) {
    .sub-title {
      line-height: 35px;
    }

    .art-left {
      width: 44.5%;
    }

    .item-min {
      height: 100px;
    }

    .splitLine {
      height: 325px;
      line-height: 325px;
    }

    .right-minitem {
      height: 45px;
      line-height: 45px;
    }

    .link-item {
      width: calc(50% - 77px);
      margin: 5px 20px;
    }
  }

  /*低分屏*/
  @media screen and (max-width: 1611px) {
    .art-left {
      width: 42%;
    }

    .item-min {
      height: 120px;
    }

    .splitLine {
      height: 375px;
      line-height: 375px;
    }

    .right-minitem {
      height: 53px;
      line-height: 53px;
    }
  }
  [data-theme=default] .div1.active1 {
      border: none !important;
  }
  .el-card__body.active2 {
      border-color: white;
  }
  .el-timeline >>> .el-icon-caret-bottom:before {
      content: none;
  }
  .el-timeline >>> .el-timeline-item__node {
      top: -8px;
  }
  .el-timeline {
      position: relative;
      left: 398px;
  }
  .title-position {
      position: relative;
      left: 422px;
      top: 24px;
      color: #4A4C66;
      font-weight: 500;
  }
  [data-theme=default] .updata-title{
      color: #4A4C66 !important;
      opacity:0.7;
  }
  p.updata-time{
      color: #878787;
  }
  .timeline{
      margin-top: 88px;
  }
  .title-color{
      color: #045340
  }
  .el-card__body >>> .el-collapse-item__header{
      height: 22px;
  }
  [data-theme=default] .arrow{
      border: #fff;
  }
  .el-timeline >>> .el-timeline-item__node.el-timeline-item__node--large{
      left: -14px;
      width: 40px;
      height: 40px;
      background: #045340 !important;
      margin-top: -28px;
      z-index: 2;
  }
  .el-timeline >>>  .title-size{
      position: relative;
      top: -38px;
      left: -35px;
      z-index: 3;
      color: #fff;
      font-size: 12px;
    }
    .test{
        width: 20px;
        height: 20px;
        margin-top: -72px;
        margin-left: -32px;
        background: white;
    }
    .show-border >>> .el-timeline-item__node{
        background: #045340;
        border-style: solid;
        border-width: 3px;
        border-color: #d9eaf9;
    }
  .hide-border >>> .el-timeline-item__node{
      background: #DDE1E4 !important;
      border-style: solid;
      border-width: 3px;
      border-color: #f5f6f6;
  }
  .show-border >>> .el-collapse-item__wrap{
      margin-top: 10px;
  }
  .li{
      font-size: 14px;
    }
  .common-config.list-container{
      background: #fff;
      padding: 18px;
      box-shadow: 0px 1px 5px 0px rgb(18 29 106 / 20%) inset;
  }
  .config-container {
      height: 100%;
      margin: 0;
      position: relative;
      border-radius: 4px;
      box-shadow: 0px 1px 5px 0px rgba(18, 29, 106, 0.20);
      background: #fff;
  }
    .history{
        height: calc(100% - 44px);
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>
<style>

  #history .el-dialog__title{
    display: block;
    font-size: 14px;
    line-height: 24px;
  }

  #history .el-dialog__body {
    overflow: hidden;
    /*padding: 20px;*/
  }
  #history .el-dialog {
    max-height: 100%;
    /*padding: 20px;*/
  }
</style>
