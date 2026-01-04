export interface CompanyData {
  companyName: string;
  type: string;
  website: string;
  country: string;
  companyType: string;
  industryDomain: string;
  entryLevelSalary: number;
  midLevelSalary: number;
  currency: string;
  role: string;
  salaryExplanation: string;
  workplaceRating: number; // 1-5
  sizeRating: number; // 1-5
}

export type ThemeColor = 
  | 'zinc' | 'slate' | 'red' | 'orange' | 'amber' 
  | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' 
  | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' 
  | 'purple' | 'fuchsia' | 'pink' | 'rose' | 'black';

export type CardIcon = 
  | '✦' | '★' | '✿' | '●' | '■' | '▲' | '⚡' | '⚓' 
  | '⚛' | '⚜' | '✺' | '❄' | '◉' | '◈' | '⚔' | '✎';

export interface SavedCard extends CompanyData {
  id: string;
  timestamp: number;
  themeColor: ThemeColor;
  icon: CardIcon;
}

export interface ExtractionResult {
  data: CompanyData;
  sources: string[];
}

export interface UserFormattedData {
  "Company Name": string;
  "Type": string;
  "Website": string;
  "Country": string;
  "Company Type": string;
  "Industry / Domain": string;
  "Role": string;
  "Entry Level Salary": number;
  "Mid Level Salary": number;
  "Currency": string;
  "Salary Explanation": string;
  "Workplace Rating": number;
  "Size Rating": number;
}
