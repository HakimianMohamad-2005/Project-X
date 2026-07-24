import { 
  saveOrderToApi, 
  fetchRecentOrdersFromApi, 
  searchOrderInApi, 
  saveB2BInquiryToApi, 
  saveLeadSampleToApi,
  normalizeDigits 
} from './api';

export const saveOrderToFirebase = saveOrderToApi;
export const fetchRecentOrdersFromFirebase = fetchRecentOrdersFromApi;
export const searchOrderInFirebase = searchOrderInApi;
export const saveB2BInquiryToFirebase = saveB2BInquiryToApi;
export const saveLeadSampleToFirebase = saveLeadSampleToApi;
export { normalizeDigits };
