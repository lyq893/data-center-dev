<script>
import { generateTitle } from 'hussar-base';
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    meta: {
      type: Object,
      default: () => {
        return {
          title: '',
          icon: ''
        };
      }
    },
    deep: Number
  },
  render(h, context) {
    context.props.meta.title = generateTitle(context.props.meta.title);
    const { icon, title } = context.props.meta;
    const vnodes = [];

    if (icon && context.props.deep <= 2) {
      vnodes.push(<svg-icon icon-class={icon}/>);
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>);
    }
    return vnodes;
  },
  methods: {
    generateTitle
  }
};
</script>
