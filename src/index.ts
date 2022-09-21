import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';

export type S3ConfigOptions = S3ClientConfig & {
  cdn?: string;
  bucket: string;
  actionOptions?: {
    upload?: PutObjectCommandInput;
    uploadStream?: PutObjectCommandInput;
    delete?: DeleteObjectCommandInput;
  };
};

export function init(config: S3ConfigOptions) {
  const S3 = new S3Client(config);

  const upload = (
    file: any,
    customParams: PutObjectCommandInput | Object = {}
  ) => {
    const path = file.path ? `${file.path}/` : '';
    const Key = `${path}${file.hash}${file.ext}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: config.bucket,
      Key,
      Body: file.stream || Buffer.from(file.buffer, 'binary'),
      ACL: 'public-read',
      ContentType: file.mime,
      ...customParams,
    });

    return new Promise((resolve, reject) => {
      S3.send(uploadCommand)
        .then(() => {
          if (config.cdn) {
            file.url = `${config.cdn}/${Key}`;
          } else {
            file.url = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${Key}`;
          }

          resolve(file);
        })
        .catch((err) => reject(err));
    });
  };

  return {
    uploadStream(
      file: any,
      customParams: PutObjectCommandInput | Object = config?.actionOptions
        ?.uploadStream ?? {}
    ) {
      return upload(file, customParams);
    },
    upload(
      file: any,
      customParams: PutObjectCommandInput | Object = config?.actionOptions
        ?.upload ?? {}
    ) {
      return upload(file, customParams);
    },
    delete(
      file: any,
      customParams: DeleteObjectCommandInput | Object = config?.actionOptions
        ?.delete ?? {}
    ) {
      return new Promise((resolve, reject) => {
        const path = file.path ? `${file.path}/` : '';

        S3.send(
          new DeleteObjectCommand({
            Key: `${path}${file.hash}${file.ext}`,
            Bucket: config.bucket,
            ...customParams,
          })
        )
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });
    },
  };
}
