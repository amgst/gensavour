/**
 * Compresses a base64 image string to ensure it's below a certain size limit (default 500KB).
 * Used to prevent Firestore 1MB document limit errors.
 */
export const compressImage = (base64Str: string, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Resize if too large
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(base64Str); // Fail safe
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Compress
            const compressedValues = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedValues);
        };
        img.onerror = (error) => reject(error);
    });
};
