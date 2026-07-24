import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order, LeadForm, B2BForm } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore DB (using specified named database ID if present)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

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
    const q = query(ordersCol, limit(20));
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

// Search order by orderCode or customer phone in Firebase Firestore
export async function searchOrderInFirebase(searchTerm: string): Promise<Order | null> {
  try {
    const ordersCol = collection(db, 'orders');
    
    // First try exact match on orderCode
    const qCode = query(ordersCol, where('orderCode', '==', searchTerm.trim()));
    const codeSnapshot = await getDocs(qCode);
    
    if (!codeSnapshot.empty) {
      return codeSnapshot.docs[0].data() as Order;
    }
    
    // If not found, try match on customer phone
    const qPhone = query(ordersCol, where('customerInfo.phone', '==', searchTerm.trim()));
    const phoneSnapshot = await getDocs(qPhone);
    
    if (!phoneSnapshot.empty) {
      return phoneSnapshot.docs[0].data() as Order;
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
