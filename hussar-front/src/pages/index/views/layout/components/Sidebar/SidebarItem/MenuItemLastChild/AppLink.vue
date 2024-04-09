<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to, externalUrl, onlyOneChild)">
    <slot />
  </component>
</template>

<script>
import * as _ from 'lodash';
import { OPEN_MODE_EXTERNAL, OPEN_MODE_INTERNAL } from '@/utils/Constants';

export default {
  name: 'AppLink',
  props: {
    to: {
      type: String,
      required: true
    },
    externalUrl: {
      type: String,
      required: true
    },
    onlyOneChild: {
      type: Object,
      required: true
    }
  },
  methods: {
    linkProps(url, externalUrl, onlyOneChild) {
      if (externalUrl === OPEN_MODE_INTERNAL) {
        const onlyOneChildObj = _.cloneDeep(onlyOneChild);
        onlyOneChildObj.query = {};
        onlyOneChildObj.query.tablePageTitle = onlyOneChildObj.meta.title;
        onlyOneChildObj.query.systemParams = JSON.stringify({
          openType: 0,
          tabName: url
        });
        return {
          is: 'router-link',
          to: onlyOneChildObj
        };
      } else {
        if (externalUrl === OPEN_MODE_EXTERNAL && onlyOneChild.meta.externalLinks) {
          return {
            is: 'a',
            href: onlyOneChild.meta.externalLinks,
            target: '_blank',
            rel: 'noopener'
          };
        } else {
          return {
            is: 'a',
            to: ''
          };
        }
      }
    }
  }
};
</script>
