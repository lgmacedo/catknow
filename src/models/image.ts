export type BaseImage = {
  id: string;
  width: number;
  height: number;
  url: string;
};

export type Image = BaseImage & {
  breeds?: Record<string, any>[];
  categories?: Record<string, any>[];
};
