declare interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string; // AppMimeType
  size: number;
  buffer: Buffer | string;
}

declare type AppMimeType =
  | 'image/png'
  | 'image/jpeg';