import { CompanyData } from "../types";

export const generateGeminiPrompt = (url: string): string => {
  return `I will provide a company URL: "${url}"

Please act as a Data Extraction Engine. Your task is to extract specific details about this company and return them in a strict JSON format.

CRITICAL RULE FOR ROLE:
You must look SPECIFICALLY for "Product Designer", "UI/UX Designer", or "Experience Designer" roles. 
If exact data for these is not found, default to "Product Designer" and estimate salaries based on the company location and industry standard for Design roles.

RULES:
1. Return ONLY a single valid JSON object.
2. Do NOT wrap the output in markdown code blocks.
3. Salaries must be annual.

JSON STRUCTURE:
{
  "companyName": "String",
  "type": "String (Product / Tech / Service / Platform)",
  "website": "String (URL)",
  "country": "String (HQ Location)",
  "companyType": "String (e.g. Startup, Scale-up, Enterprise)",
  "industryDomain": "String (e.g. SaaS, FinTech, AI)",
  "entryLevelSalary": Number (Annual base salary integer for Junior/Entry Designer (0-2 yrs). Estimate if needed.),
  "midLevelSalary": Number (Annual base salary integer for Mid-Level Designer (2-5 yrs). Estimate if needed.),
  "currency": "String (ISO code e.g. USD, VND)",
  "role": "String (Must be Design related, e.g. Product Designer)",
  "salaryExplanation": "String (Source or reasoning for the numbers)",
  "workplaceRating": Number (Integer 1-5. Estimate the 'Great Place to Work' vibe based on benefits, culture pages, and reputation. 5 is best.),
  "sizeRating": Number (Integer 1-5. Estimate company size/scale. 1=Seed/Startup (<50), 3=Mid-size (200+), 5=Enterprise/Big Tech (1000+).)
}

Analyze the URL now and return the JSON.`;
};

export const parseGeminiResponse = (jsonString: string): CompanyData => {
  try {
    // Clean up potential markdown if the user copies it by accident
    const cleaned = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as CompanyData;
  } catch (e) {
    throw new Error("Invalid JSON format. Please ensure you copied the entire JSON response from Gemini.");
  }
};
