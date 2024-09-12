"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = __importDefault(require("next-intl/plugin"));
const merge_1 = require("../merge");
module.exports = function createNextIntlSplitPlugin(dictionariesPath, i18nPath) {
    if (process.env.NODE_ENV === 'production') {
        (0, merge_1.mergeMessages)(dictionariesPath);
    }
    return (0, plugin_1.default)(i18nPath);
};
