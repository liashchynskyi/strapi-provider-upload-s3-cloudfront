# Why?

This plugin is based on [https://www.npmjs.com/package/@strapi/provider-upload-aws-s3](https://www.npmjs.com/package/@strapi/provider-upload-aws-s3) with the ability to serve files from Cloudfront. Build with `@aws-sdk/client-s3`.

# Installation

```sh
npm install @liashchynskyi/strapi-provider-upload-s3-cloudfront
# or
yarn add @liashchynskyi/strapi-provider-upload-s3-cloudfront
```

# Configuration

All available [configs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientresolvedconfig.html).

```ts
// config/plugins.ts

import { S3ConfigOptions } from '@liashchynskyi/strapi-provider-upload-s3-cloudfront'

export default ({ env }) => ({
  upload: {
    config: {
      provider: '@liashchynskyi/strapi-provider-upload-s3-cloudfront',
      providerOptions: {
        credentials: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
        },
        region: env('AWS_S3_BUCKET_LOCATION'),
        bucket: env('AWS_S3_BUCKET_PREFIX'),
        cdn: env('AWS_CLOUDFRONT_DOMAIN'),
      },
    },
  },
});

```
