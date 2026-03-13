export interface Activity {
  details: string;
  state?: string;
  assets: {
    large_image: string;
    large_text: string;
  };
  timestamps: {
    start: number;
  };
}
