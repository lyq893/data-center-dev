import { caching } from 'hussar-base';

function uploadHeaders() {
  const HussarBase = 'hussar-base';
  const tenantId = caching.local.get('TENANTID') === '' || caching.local.get('TENANTID') === undefined ||
  caching.local.get('TENANTID') === null ? '145078653991140353' : caching.local.get('TENANTID');
  return { Authorization: caching.local.get('HussarToken'), 'TENANT-ID': tenantId, 'client-id': HussarBase };
}

export { uploadHeaders };
