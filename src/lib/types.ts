export type Novel = {
  id: string;
  title: string;
  description: string;
  quote: string;
  coverImage: string;
  pdfUrl: string;
  releaseDate: string;
  isFeatured: boolean;
};

export type FileUploadResult = {
  url: string;
  path: string;
};
