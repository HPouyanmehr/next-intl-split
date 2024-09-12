"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeMessages = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const load_1 = require("../load");
const write_1 = require("../write");
const isRelativePath = (pathToCheck) => pathToCheck.startsWith(`./`);
const doesPathExist = (pathToCheck) => (0, fs_1.existsSync)(pathToCheck);
const mergeMessages = (pathToDictionaries) => {
    const pathIsRelative = isRelativePath(pathToDictionaries);
    if (!pathIsRelative) {
        throw new Error(`Please provide the RELATIVE path to the dictionaries folder. Like, ./src/i18n/dictionaries`);
    }
    const absolutePath = path_1.default.resolve(process.cwd(), pathToDictionaries);
    const pathExist = doesPathExist(absolutePath);
    if (!pathExist) {
        throw new Error(`The provided path to the dictionaries does not exist! ${absolutePath}`);
    }
    const messages = (0, load_1.loadMessages)(absolutePath);
    (0, write_1.writeMessages)(absolutePath, messages);
};
exports.mergeMessages = mergeMessages;
