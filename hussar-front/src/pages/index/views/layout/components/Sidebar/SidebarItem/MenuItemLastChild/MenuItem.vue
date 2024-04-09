<script>
import { generateTitle } from 'hussar-base';
import { getMenuIcon } from '../getMenuIcon';

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    deep: {
      type: Number,
      required: true
    },
    meta: {
      type: Object,
      default: () => {
        return {
          title: '',
          icon: ''
        };
      }
    }
  },
  render(h, context) {
    context.props.meta.title = generateTitle(context.props.meta.title);
    const {
      icon,
      title
    } = context.props.meta;
    const vnodes = [];

    const svgIconClass = getMenuIcon(icon, context.props.deep);
    vnodes.push(<svg-icon icon-class={ `${svgIconClass}` }/>);

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>);
    }
    return vnodes;
  },
  methods: {
    generateTitle,
    getMenuIcon
  }
};
</script>
