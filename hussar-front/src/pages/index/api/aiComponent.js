import { hussarRequest } from 'hussar-base';

export function getUploadInvoice(data) {
  return hussarRequest.post('/aiComponent/upload_invoice', data, { headers: { 'Content-type': 'multipart/form-data' }});
}
