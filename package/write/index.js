"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMessages = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const extractLocalesAndMessages = (messages) => Object.entries(messages);
const writeMessages = (dictionariesPath, messages) => {
    const localeMessagesMap = extractLocalesAndMessages(messages);
    console.log('\n');
    console.log('  ▲ Next Intl Split');
    for (let index = 0; index < localeMessagesMap.length; index++) {
        const locale = localeMessagesMap[index][0];
        const localeMessages = localeMessagesMap[index][1];
        try {
            const pathToWrite = path_1.default.resolve(dictionariesPath, `${locale}.json`);
            const content = JSON.stringify(localeMessages, null, 2);
            (0, fs_1.writeFileSync)(pathToWrite, content);
            console.log(`\tSuccessfully merged JSON content for ${locale}`);
        }
        catch (error) {
            console.error('The following error occured in writer in next-intl-split.', error);
        }
    }
    console.log('\n');
};
exports.writeMessages = writeMessages;
