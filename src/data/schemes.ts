export interface SchemeInfo {
  code: string;
  name: string;
  category: string;
  fundHouse: string;
  sourceUrl: string;
  /** Icon identifier — maps to a lucide-react icon in the UI */
  icon: 'building' | 'layers' | 'shield' | 'chart' | 'balance';
  /** Color identifier for tinted icon container */
  color: 'green' | 'blue' | 'purple' | 'amber' | 'teal';
}

export const HDFC_SCHEMES: SchemeInfo[] = [
  {
    code: 'HDFC001',
    name: 'HDFC Large Cap Fund',
    category: 'Equity — Large Cap',
    fundHouse: 'HDFC Mutual Fund',
    sourceUrl: 'https://www.hdfcfund.com/explore/mutual-funds/hdfc-large-cap-fund/regular',
    icon: 'building',
    color: 'green',
  },
  {
    code: 'HDFC002',
    name: 'HDFC Flexi Cap Fund',
    category: 'Equity — Flexi Cap',
    fundHouse: 'HDFC Mutual Fund',
    sourceUrl: 'https://www.hdfcfund.com/explore/mutual-funds/hdfc-flexi-cap-fund/regular',
    icon: 'layers',
    color: 'blue',
  },
  {
    code: 'HDFC003',
    name: 'HDFC ELSS Tax Saver',
    category: 'Equity — ELSS',
    fundHouse: 'HDFC Mutual Fund',
    sourceUrl: 'https://www.hdfcfund.com/explore/mutual-funds/hdfc-elss-tax-saver/regular',
    icon: 'shield',
    color: 'purple',
  },
  {
    code: 'HDFC004',
    name: 'HDFC Mid Cap Fund',
    category: 'Equity — Mid Cap',
    fundHouse: 'HDFC Mutual Fund',
    sourceUrl: 'https://www.hdfcfund.com/explore/mutual-funds/hdfc-mid-cap-fund/regular',
    icon: 'chart',
    color: 'amber',
  },
  {
    code: 'HDFC005',
    name: 'HDFC Balanced Advantage Fund',
    category: 'Hybrid — Dynamic Asset Allocation',
    fundHouse: 'HDFC Mutual Fund',
    sourceUrl: 'https://www.hdfcfund.com/explore/mutual-funds/hdfc-balanced-advantage-fund/regular',
    icon: 'balance',
    color: 'teal',
  },
];
