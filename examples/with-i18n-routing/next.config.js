const createNextIntlSplitPlugin = require('next-intl-split/plugin');

const withNextIntlSplit = createNextIntlSplitPlugin('./src/messages');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntlSplit(nextConfig);
