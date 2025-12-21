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

    // Save entire menu to Firestore (overwrite)
    saveMenu: async (menu: MenuItem[]): Promise<void> => {
        try {
            const batch = writeBatch(db);

            // Note: This is a simplified approach. Ideally we'd sync differences.
            // For now, we'll overwrite documents based on ID.
            menu.forEach((item) => {
                const docRef = doc(db, MENU_COLLECTION, item.id);
                batch.set(docRef, item);
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
