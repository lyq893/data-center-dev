function comfirmConsignorPublic (rootKey, consignorInputIns, self, argument) {
  self[rootKey + 'FlowData'].consignorSelect = argument.consignors;
  self[consignorInputIns] = argument.consignorNames;
  self[rootKey + 'SelectedConsignorBackup'] = argument.tableSelects;
}

export { comfirmConsignorPublic };
