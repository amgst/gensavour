import { db } from '../firebase';
import { collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore';
import { MenuItem } from '../types';
import { INITIAL_MENU } from '../constants';

const MENU_COLLECTION = 'menu';

export const menuService = {
    // Fetch menu from Firestore
    fetchMenu: async (): Promise<MenuItem[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
            const menuItems: MenuItem[] = [];
            querySnapshot.forEach((doc) => {
                menuItems.push(doc.data() as MenuItem);
            });
            return menuItems;
        } catch (error) {
            console.error("Error fetching menu:", error);
            throw error;
        }
    },

    // Save entire menu to Firestore (overwrite with diffing)
    saveMenu: async (menu: MenuItem[]): Promise<void> => {
        try {
            const batch = writeBatch(db);

            // 1. Get all existing docs to identify deletions
            const snapshot = await getDocs(collection(db, MENU_COLLECTION));
            const existingIds = new Set<string>();
            snapshot.forEach(doc => existingIds.add(doc.id));

            // 2. Set/Update items
            // We need to process sequentially or Promise.all to handle async compression
            await Promise.all(menu.map(async (item) => {
                const docRef = doc(db, MENU_COLLECTION, item.id);

                // Compress image if it's a base64 string
                let processedImage = item.image;
                if (item.image && item.image.startsWith('data:image')) {
                    try {
                        const { compressImage } = await import('../utils/imageUtils');
                        processedImage = await compressImage(item.image);
                    } catch (e) {
                        console.warn('Image compression failed, trying original', e);
                    }
                }

                // Sanitize undefined values
                const itemToSave = { ...item, image: processedImage };
                const sanitizedItem = JSON.parse(JSON.stringify(itemToSave));

                batch.set(docRef, sanitizedItem);
                existingIds.delete(item.id);
            }));

            // 3. Delete removed items
            existingIds.forEach(id => {
                const docRef = doc(db, MENU_COLLECTION, id);
                batch.delete(docRef);
            });

            await batch.commit();
        } catch (error) {
            console.error("Error saving menu:", error);
            throw error;
        }
    },

    // Initialize menu if empty
    initializeMenu: async (): Promise<MenuItem[]> => {
        try {
            const currentMenu = await menuService.fetchMenu();
            if (currentMenu.length === 0) {
                console.log("Initializing menu in Firestore...");
                await menuService.saveMenu(INITIAL_MENU);
                return INITIAL_MENU;
            }
            return currentMenu;
        } catch (error) {
            console.error("Error initializing menu:", error);
            throw error;
        }
    }
};
