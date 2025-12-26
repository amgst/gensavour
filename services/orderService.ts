import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, Timestamp, onSnapshot, where } from 'firebase/firestore';
import { Order, OrderStatus } from '../types';

const ORDERS_COLLECTION = 'orders';

const generatePublicId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Distinct characters
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const orderService = {
    // Save a new order
    saveOrder: async (orderData: Omit<Order, 'id'>): Promise<{ id: string, publicId: string }> => {
        try {
            // Create a clean copy of the data and remove potential large fields like images from items
            const cleanedItems = orderData.items.map(item => {
                const { image, ...itemWithoutImage } = item;
                return itemWithoutImage;
            });

            const publicId = generatePublicId();

            const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
                // Sanitize undefined values for Firestore
                ...JSON.parse(JSON.stringify({
                    ...orderData,
                    items: cleanedItems,
                    publicId
                })),
                timestamp: Timestamp.now() // Use server timestamp or convert string to timestamp
            });
            return { id: docRef.id, publicId };
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
    // Live Subscription for a SINGLE order (Supports both Doc ID and Public ID)
    subscribeToOrder: (id: string, callback: (order: Order | null) => void): (() => void) => {
        // If ID is short (8 chars or less), treat as publicId
        if (id.length <= 8) {
            const q = query(collection(db, ORDERS_COLLECTION), where('publicId', '==', id.toUpperCase()));
            return onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    const docSnap = snapshot.docs[0];
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
                console.error("Error in public order subscription:", error);
            });
        }

        // Otherwise treat as specific Document ID
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
    },

    // Find orders by Phone Number
    getOrdersByPhone: async (phone: string): Promise<Order[]> => {
        try {
            const q = query(collection(db, ORDERS_COLLECTION), where('phone', '==', phone));
            const snapshot = await getDocs(q);
            const orders = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
                } as Order;
            });
            // Sort by timestamp desc (newest first)
            return orders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        } catch (error) {
            console.error("Error finding orders by phone:", error);
            throw error;
        }
    }
};
