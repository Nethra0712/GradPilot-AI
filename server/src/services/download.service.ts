/**
 * DownloadService
 *
 * Abstract foundation service to export generated documents.
 * Defines stubs for PDF, DOCX, and fully implements Markdown and TXT file outputs.
 */
export abstract class DownloadService {
  /**
   * Generates a plain text file representation.
   */
  public abstract exportToTxt(content: string): Promise<Buffer>;

  /**
   * Generates a fully formatted markdown file payload.
   */
  public abstract exportToMarkdown(content: string): Promise<Buffer>;

  /**
   * Generates a PDF buffer mapping.
   */
  public abstract exportToPdf(content: string): Promise<Buffer>;

  /**
   * Generates a DOCX word processing document payload.
   */
  public abstract exportToDocx(content: string): Promise<Buffer>;
}

export class MockDownloadService extends DownloadService {
  public async exportToTxt(content: string): Promise<Buffer> {
    return Buffer.from(content, 'utf-8');
  }

  public async exportToMarkdown(content: string): Promise<Buffer> {
    // Return markdown text converted to binary payload
    return Buffer.from(content, 'utf-8');
  }

  public async exportToPdf(content: string): Promise<Buffer> {
    // Return mock PDF signature
    return Buffer.from(
      `%PDF-1.4 [Mock PDF Binary Data for: "${content.substring(0, 50)}..."]`,
      'utf-8'
    );
  }

  public async exportToDocx(content: string): Promise<Buffer> {
    // Return mock DOCX signature
    return Buffer.from(`[Mock DOCX Binary Data for: "${content.substring(0, 50)}..."]`, 'utf-8');
  }
}

export const downloadService = new MockDownloadService();
export default downloadService;
