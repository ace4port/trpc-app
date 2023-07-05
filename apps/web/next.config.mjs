
// @ts-ignore
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['db', 'auth', 'api' ],
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    if (isServer) config.plugins.push(new PrismaPlugin())
    return config
  },
};

export default config;
