const navigation = {
  state: {
    navigationMeta: {},
    itemObj: {}
  },
  mutations: {
    SET_META: (state, meta) => {
      state.navigationMeta = meta;
    },
    setItemObj(state, payload) {
      state.itemObj = payload.itemObj;
    }
  }
};
export default navigation;
