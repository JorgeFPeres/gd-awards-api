import * as fs from 'fs';
import * as path from 'path';
import { injectable } from 'inversify';
import { Movie } from '../../domain/entities/Movie';

@injectable()
export class CsvLoader {
  load(filePath: string): Partial<Movie>[] {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');

    // First line is header
    const header = lines[0].split(';');
    const dataLines = lines.slice(1);

    return dataLines.map(line => {
      const values = this.parseCsvLine(line);
      
      return {
        year: parseInt(values[0], 10),
        title: values[1],
        studios: values[2],
        producers: values[3],
        winner: values[4]?.toLowerCase() === 'yes',
      };
    });
  }

  private parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ';' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    return values;
  }
}

