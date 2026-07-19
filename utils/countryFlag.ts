const countryToCode: Record<string, string> = {
  'france': 'FR', 'allemagne': 'DE', 'espagne': 'ES', 'italie': 'IT',
  'royaume-uni': 'GB', 'angleterre': 'GB', 'états-unis': 'US', 'etats-unis': 'US',
  'canada': 'CA', 'australie': 'AU', 'japon': 'JP', 'chine': 'CN',
  'brésil': 'BR', 'bresil': 'BR', 'mexique': 'MX', 'inde': 'IN',
  'russie': 'RU', 'corée du sud': 'KR', 'turquie': 'TR', 'pays-bas': 'NL',
  'belgique': 'BE', 'suisse': 'CH', 'suède': 'SE', 'suede': 'SE',
  'norvège': 'NO', 'norvege': 'NO', 'danemark': 'DK', 'finlande': 'FI',
  'pologne': 'PL', 'portugal': 'PT', 'grèce': 'GR', 'grece': 'GR',
  'autriche': 'AT', 'hongrie': 'HU', 'tchéquie': 'CZ', 'roumanie': 'RO',
  'maroc': 'MA', 'algérie': 'DZ', 'algerie': 'DZ', 'tunisie': 'TN',
  'égypte': 'EG', 'egypte': 'EG', 'afrique du sud': 'ZA', 'nigeria': 'NG',
  'kenya': 'KE', 'éthiopie': 'ET', 'ethiopie': 'ET', 'ghana': 'GH',
  'arabie saoudite': 'SA', 'émirats arabes unis': 'AE', 'emirats arabes unis': 'AE',
  'iran': 'IR', 'irak': 'IQ', 'israël': 'IL', 'israel': 'IL',
  'thaïlande': 'TH', 'thailande': 'TH', 'vietnam': 'VN', 'indonésie': 'ID',
  'indonesie': 'ID', 'malaisie': 'MY', 'philippines': 'PH', 'singapour': 'SG',
  'pakistan': 'PK', 'bangladesh': 'BD', 'népal': 'NP', 'nepal': 'NP',
  'sri lanka': 'LK', 'myanmar': 'MM', 'cambodge': 'KH',
  'argentine': 'AR', 'chili': 'CL', 'colombie': 'CO', 'pérou': 'PE',
  'peru': 'PE', 'venezuela': 'VE', 'équateur': 'EC', 'equateur': 'EC',
  'bolivie': 'BO', 'uruguay': 'UY', 'paraguay': 'PY', 'cuba': 'CU',
  'nouvelle-zélande': 'NZ', 'irlande': 'IE', 'croatie': 'HR', 'serbie': 'RS',
  'ukraine': 'UA', 'slovaquie': 'SK', 'bulgarie': 'BG', 'lituanie': 'LT',
  'lettonie': 'LV', 'estonie': 'EE', 'slovénie': 'SI', 'luxembourg': 'LU',
  'islande': 'IS', 'taiwan': 'TW', 'hong kong': 'HK', 'mongolie': 'MN',
  'sénégal': 'SN', 'senegal': 'SN', 'côte d\'ivoire': 'CI', 'cameroun': 'CM',
  'afghanistan': 'AF', 'syrie': 'SY', 'liban': 'LB', 'jordanie': 'JO',
  'koweït': 'KW', 'koweit': 'KW', 'qatar': 'QA', 'bahreïn': 'BH',
  'oman': 'OM', 'yémen': 'YE', 'yemen': 'YE',
};

export function getCountryCode(countryName: string): string {
  return countryToCode[countryName.toLowerCase().trim()] ?? '';
}

export function getFlagUrl(countryName: string): string {
  const code = getCountryCode(countryName);
  if (!code) return '';
  return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;
}
