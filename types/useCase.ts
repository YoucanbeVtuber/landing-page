export interface UseCaseStep {
  title: string;
  description: string;
  visualType: 'upload' | 'split' | 'select' | 'input' | 'result' | 'export';
}

export interface ProgressRange {
  start: number;
  end: number;
}
