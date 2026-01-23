export interface DatabaseInterface {
  exportData(): Promise<Buffer>;
  importData(data: Buffer): Promise<void>;
}