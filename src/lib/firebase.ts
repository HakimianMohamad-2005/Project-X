import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore,
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order, LeadForm, B2BForm } from '../types';

// Helper functions for digit & search normalization
export function normalizeDigits(str: string): string {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => (d.charCodeAt(0) - 1776).toString())
    .replace(/[٠-٩]/g, (d) => (d.charCodeAt(0) - 1632).toString())
    .replace(/[\s\-_]/g, '')
    .toLowerCase();
}

export function toPersianDigitsStr(str: string): string {
  if (!str) return '';
  return str.replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) + 1776));
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore DB with force long polling to bypass WebChannel/gRPC streaming CORS/network issues
export const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });

// Save new order to Firebase Firestore
export async function saveOrderToFirebase(order: Order): Promise<boolean> {
  try {
    const orderDocRef = doc(db, 'orders', order.orderCode);
    await setDoc(orderDocRef, {
      ...order,
      savedAt: new Date().toISOString()
    });
    console.log('Order saved to Firebase Firestore successfully:', order.orderCode);
    return true;
  } catch (error) {
    console.error('Error saving order to Firebase Firestore:', error);
    return false;
  }
}

// Fetch recent orders from Firebase Firestore
export async function fetchRecentOrdersFromFirebase(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, limit(30));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data() as Order;
      orders.push(data);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders from Firebase Firestore:', error);
    return [];
  }
}

// Search order by orderCode or customer phone in Firebase Firestore with flexible digit/prefix matching
export async function searchOrderInFirebase(searchTerm: string): Promise<Order | null> {
  try {
    const raw = searchTerm.trim();
    if (!raw) return null;

    const engDigits = normalizeDigits(raw);
    const faDigits = toPersianDigitsStr(engDigits);
    
    // Generate candidate lookup strings
    const candidates = new Set<string>();
    candidates.add(raw);
    candidates.add(engDigits);
    candidates.add(faDigits);

    if (!engDigits.startsWith('og3')) {
      candidates.add(`OG3-${engDigits}`);
      candidates.add(`OG3-${faDigits}`);
      candidates.add(`og3-${engDigits}`);
      candidates.add(`og3-${faDigits}`);
    } else {
      const numEng = engDigits.replace(/^og3/, '');
      const numFa = toPersianDigitsStr(numEng);
      candidates.add(numEng);
      candidates.add(numFa);
    }

    const candArray = Array.from(candidates).slice(0, 30);

    // Query 1: Search by orderCode using 'in'
    const ordersCol = collection(db, 'orders');
    const qCode = query(ordersCol, where('orderCode', 'in', candArray));
    const codeSnapshot = await getDocs(qCode);

    if (!codeSnapshot.empty) {
      return codeSnapshot.docs[0].data() as Order;
    }

    // Query 2: Search by phone using 'in'
    const qPhone = query(ordersCol, where('customerInfo.phone', 'in', candArray));
    const phoneSnapshot = await getDocs(qPhone);

    if (!phoneSnapshot.empty) {
      return phoneSnapshot.docs[0].data() as Order;
    }

    // Query 3: Client-side normalized fallback over recent orders
    const qRecent = query(ordersCol, limit(50));
    const recentSnapshot = await getDocs(qRecent);
    for (const docSnap of recentSnapshot.docs) {
      const orderData = docSnap.data() as Order;
      const normOrderCode = normalizeDigits(orderData.orderCode || '');
      const normPhone = normalizeDigits(orderData.customerInfo?.phone || '');
      
      if (
        normOrderCode.includes(engDigits) || 
        normPhone.includes(engDigits) || 
        (engDigits.length >= 4 && normOrderCode.endsWith(engDigits))
      ) {
        return orderData;
      }
    }

    return null;
  } catch (error) {
    console.error('Error searching order in Firebase Firestore:', error);
    return null;
  }
}

// Save B2B inquiry to Firebase Firestore
export async function saveB2BInquiryToFirebase(b2bData: B2BForm): Promise<boolean> {
  try {
    const b2bCol = collection(db, 'b2b_inquiries');
    await addDoc(b2bCol, {
      ...b2bData,
      createdAt: new Date().toISOString()
    });
    console.log('B2B inquiry saved to Firebase Firestore');
    return true;
  } catch (error) {
    console.error('Error saving B2B inquiry to Firebase Firestore:', error);
    return false;
  }
}

// Save Sample PDF lead request to Firebase Firestore
export async function saveLeadSampleToFirebase(leadData: LeadForm): Promise<boolean> {
  try {
    const leadCol = collection(db, 'lead_samples');
    await addDoc(leadCol, {
      ...leadData,
      createdAt: new Date().toISOString()
    });
    console.log('Lead sample request saved to Firebase Firestore');
    return true;
  } catch (error) {
    console.error('Error saving lead sample to Firebase Firestore:', error);
    return false;
  }
}
