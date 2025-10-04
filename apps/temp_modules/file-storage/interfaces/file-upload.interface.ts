import { Express } from 'express';

export interface FileUpload extends Express.Multer.File {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  fieldname: string;
  encoding: string;
  destination: string;
  filename: string;
  path: string;
}

export interface UploadPatientPhotoOptions {
  file: FileUpload;
  patientId: string;
}

export interface UploadPatientDocumentOptions {
  file: FileUpload;
  patientId: string;
  documentType: string;
}
