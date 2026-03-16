(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReceiptPrinterEncoder = factory());
})(this, (function () { 'use strict';

    const codepages = {
        'cp437': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
        'cp850': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ',
        'cp852': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
        'cp858': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ',
        'cp860': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ',
        'cp863': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ',
        'cp865': 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ',
        'cp866': 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ ',
        'cp1251': 'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя',
    };

    class ReceiptPrinterEncoder {

        /**
         * The printer language
         * @private
         */
        language = 'esc-pos';

        /**
         * The code page
         * @private
         */
        codepage = 'cp437';

        /**
         * The encoded data
         * @private
         */
        data = [];

        /**
         * Create a new ReceiptPrinterEncoder
         * 
         * @param {object} options The options
         */
        constructor(options) {
            if (options && options.language) {
                this.language = options.language;
            }

            if (options && options.codepage) {
                this.codepage = options.codepage;
            }
        }

        /**
         * Initialize the printer
         * 
         * @returns {ReceiptPrinterEncoder}
         */
        initialize() {
            this.data.push(27, 64);
            return this;
        }

        /**
         * Set the code page
         * 
         * @param {string} codepage The code page
         * @returns {ReceiptPrinterEncoder}
         */
        setCodepage(codepage) {
            this.codepage = codepage;
            return this;
        }

        /**
         * Print text
         * 
         * @param {string} text The text to print
         * @returns {ReceiptPrinterEncoder}
         */
        text(text) {
            for (let i = 0; i < text.length; i++) {
                let char = text.charCodeAt(i);
                if (char >= 128) {
                    let index = codepages[this.codepage].indexOf(text[i]);
                    if (index !== -1) {
                        char = index + 128;
                    }
                }
                this.data.push(char);
            }
            return this;
        }

        /**
         * Print a newline
         * 
         * @returns {ReceiptPrinterEncoder}
         */
        newline() {
            this.data.push(10);
            return this;
        }

        /**
         * Print a QR code
         * 
         * @param {string} data The data to encode
         * @returns {ReceiptPrinterEncoder}
         */
        qrcode(data) {
            if (this.language === 'esc-pos') {
                // Set the QR code model
                this.data.push(29, 40, 107, 4, 0, 49, 65, 50, 0);

                // Set the QR code size
                this.data.push(29, 40, 107, 3, 0, 49, 67, 3);

                // Set the QR code error correction level
                this.data.push(29, 40, 107, 3, 0, 49, 69, 48);

                // Store the QR code data
                let length = data.length + 3;
                this.data.push(29, 40, 107, length % 256, length / 256, 49, 80, 48);
                for (let i = 0; i < data.length; i++) {
                    this.data.push(data.charCodeAt(i));
                }

                // Print the QR code
                this.data.push(29, 40, 107, 3, 0, 49, 81, 48);
            }

            if (this.language === 'star-prnt') {
                // TODO: Implement StarPRNT QR code
            }

            return this;
        }

        /**
         * Encode the data
         * 
         * @returns {Uint8Array}
         */
        encode() {
            return new Uint8Array(this.data);
        }
    }

    return ReceiptPrinterEncoder;

}));
