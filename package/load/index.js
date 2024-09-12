"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMessages = exports.loadI18nTranslations = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const FILE_NAME = 'index.json';
const isAJSONFilePath = (filePath) => filePath.includes(FILE_NAME) && filePath.includes(path_1.default.sep);
const createNestedObject = (obj, keys) => {
    let current = obj;
    for (const key of keys) {
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }
    return { obj, lastKey: current };
};
const loadI18nTranslations = (dictionariesPath, locale) => {
    const allMessages = (0, exports.loadMessages)(dictionariesPath);
    const localeMessages = Object.entries(allMessages).filter((localeMessage) => localeMessage[0] === locale)[0][1];
    return localeMessages;
};
exports.loadI18nTranslations = loadI18nTranslations;
const loadMessages = (dictionariesPath) => {
    let messages = {};
    try {
        const files = (0, fs_1.readdirSync)(dictionariesPath, { recursive: true });
        for (let filePathIndex = 0; filePathIndex < files.length; filePathIndex++) {
            const file = files[filePathIndex];
            if (typeof file === 'string' && isAJSONFilePath(file)) {
                const fileParents = file
                    .split(path_1.default.sep)
                    .filter((parent) => parent !== FILE_NAME);
                const pathToFile = path_1.default.resolve(dictionariesPath, file);
                const fileMessages = JSON.parse((0, fs_1.readFileSync)(pathToFile, 'utf-8'));
                messages = {
                    ...messages,
                };
                const { lastKey } = createNestedObject(messages, fileParents);
                Object.assign(lastKey, fileMessages);
            }
        }
    }
    catch (error) {
        console.error('The following error occured in loader in next-intl-split.', error);
    }
    return messages;
};
exports.loadMessages = loadMessages;
