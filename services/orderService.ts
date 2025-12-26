import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';
import { Order, OrderStatus } from '../types';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
    // Save a new order
    saveOrder: async (orderData: Omit<Order, 'id'>): Promise<string> => {
        try {
            // Create a clean copy of the data and remove potential large fields like images from items
            const cleanedItems = orderData.items.map(item => {
                const { image, ...itemWithoutImage } = item;
                return itemWithoutImage;
            });

            const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
                // Sanitize undefined values for Firestore
                ...JSON.parse(JSON.stringify({
                    ...orderData,
                    items: cleanedItems
                })),
                timestamp: Timestamp.now() // Use server timestamp or convert string to timestamp
            });
            return docRef.id;
        } catch (error) {
            console.error("Error saving order:", error);
            throw error;
        }
    },

    // Fetch orders
    getOrders: async (): Promise<Order[]> => {
        try {
            const q = query(collection(db, ORDERS_COLLECTION), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convert Firestore Timestamp to string for frontend consistency if needed
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
                } as Order;
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    },

    // Get Single Order
    getOrderById: async (id: string): Promise<Order | null> => {
        try {
            const docRef = doc(db, ORDERS_COLLECTION, id);
            const docSnap = await import('firebase/firestore').then(mod => mod.getDoc(docRef));

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
                } as Order;
            }
            return null;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    },

    // Live Subscription for all orders
    subscribeToOrders: (callback: (orders: Order[]) => void): (() => void) => {
        const q = query(collection(db, ORDERS_COLLECTION), orderBy('timestamp', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
                } as Order;
            });
            callback(orders);
        }, (error) => {
            console.error("Error in order subscription:", error);
        });
    },

    // Live Subscription for a SINGLE order
    subscribeToOrder: (id: string, callback: (order: Order | null) => void): (() => void) => {
        const docRef = doc(db, ORDERS_COLLECTION, id);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const order = {
                    id: docSnap.id,
                    ...data,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
                } as Order;
                callback(order);
            } else {
                callback(null);
            }
        }, (error) => {
            console.error("Error in single order subscription:", error);
        });
    },

    updateOrderStatus: async (id: string, status: OrderStatus): Promise<void> => {
        try {
            const docRef = doc(db, ORDERS_COLLECTION, id);
            await updateDoc(docRef, { status });
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }
};
