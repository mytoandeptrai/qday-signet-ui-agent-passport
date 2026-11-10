import type { Service } from '@/types/passport';

type Row = [name: string, category: string, description: string, provider: string, price: number, popular?: boolean];

const rows: Row[] = [
  ['StablePhone', 'Voice', 'AI phone calls to businesses, billed per call.', 'Stable', 0.54, true],
  ['StableEnrich', 'Data', 'Find company owners and verified emails.', 'Stable', 0.04, true],
  ['AgentRes', 'Booking', 'Book restaurant tables through Resy.', 'AgentRes', 0.01, true],
  ['Signet Shopping', 'Shopping', 'Order from Amazon to any address.', 'Signet', 0.25, true],
  ['PostalForm', 'Mail', 'Print and mail letters to a street address.', 'PostalForm', 1.15, true],
  ['AgentFax', 'Mail', 'Send a fax to any number.', 'AgentFax', 0.2],
  ['Hugen Weather', 'Data', 'Hourly forecasts for any location.', 'Hugen', 0.01],
  ['GeoLookup', 'Data', 'Geocode and reverse-geocode addresses.', 'GeoLookup', 0.002],
  ['DocParse', 'Documents', 'Extract text and tables from PDFs.', 'DocParse', 0.03],
  ['Translate API', 'Language', 'Translate text across 90 languages.', 'Lingua', 0.005],
  ['FlightSearch', 'Travel', 'Search fares across major airlines.', 'SkyGrid', 0.08],
  ['HotelRates', 'Travel', 'Compare hotel rates by city and date.', 'SkyGrid', 0.06],
  ['SMS Relay', 'Messaging', 'Send SMS to US and EU numbers.', 'Relay', 0.012],
  ['EmailVerify', 'Data', 'Check if an email address can receive mail.', 'Verifly', 0.004],
  ['LeadScore', 'Sales', 'Score inbound leads against your profile.', 'Pipeline', 0.07],
  ['CompanyGraph', 'Sales', 'Funding, headcount and tech stack of a company.', 'Pipeline', 0.09],
  ['PriceWatch', 'Shopping', 'Track price changes on any product page.', 'Kestrel', 0.015],
  ['NewsDigest', 'Data', 'Summaries of news on a topic.', 'Gazette', 0.02],
  ['SpeechToText', 'Voice', 'Transcribe audio files.', 'Lingua', 0.006],
  ['TextToSpeech', 'Voice', 'Natural voices in 30 languages.', 'Lingua', 0.008],
  ['ImageGen', 'Media', 'Generate an image from a prompt.', 'Prism', 0.04],
  ['VideoClip', 'Media', 'Cut a clip from a long video.', 'Prism', 0.12],
  ['CourierQuote', 'Logistics', 'Same-day courier quotes in 40 cities.', 'Dispatch', 0.1],
  ['ParcelTrack', 'Logistics', 'Track parcels across 600 carriers.', 'Dispatch', 0.003],
  ['TaxRates', 'Finance', 'Sales tax rates by address.', 'Ledgerly', 0.002],
  ['FxRates', 'Finance', 'Live and historical exchange rates.', 'Ledgerly', 0.001],
  ['InvoiceMaker', 'Finance', 'Generate a PDF invoice.', 'Ledgerly', 0.05],
  ['CalendarSlot', 'Booking', 'Find a free slot across calendars.', 'Slotly', 0.01],
  ['TableFinder', 'Booking', 'Search restaurants with open tables.', 'AgentRes', 0.005],
  ['PermitCheck', 'Legal', 'Look up local business permits.', 'Civic', 0.25],
  ['TrademarkSearch', 'Legal', 'Search trademark filings by name.', 'Civic', 0.18],
  ['WebScrape', 'Data', 'Fetch and clean a web page.', 'Kestrel', 0.01],
  ['SearchAPI', 'Data', 'Web search results as JSON.', 'Kestrel', 0.005],
  ['MapRoute', 'Travel', 'Driving and transit routes.', 'GeoLookup', 0.004],
  ['GiftCards', 'Shopping', 'Buy digital gift cards.', 'Signet', 0.5],
  ['PrintShop', 'Mail', 'Order printed business cards.', 'PostalForm', 6.5],
  ['ReviewPulse', 'Sales', 'Collect and summarize customer reviews.', 'Pipeline', 0.06],
];

export const SERVICES: Service[] = rows.map(([name, category, description, provider, price, popular], i) => ({
  id: `svc_${String(i + 1).padStart(3, '0')}`,
  name,
  category,
  description,
  provider,
  pricePerCall: price,
  priceLabel: price < 0.01 ? `$${price.toFixed(3)} a call` : `$${price.toFixed(2)} a call`,
  popular: Boolean(popular),
}));

export const SERVICE_CATEGORIES = ['All', ...Array.from(new Set(SERVICES.map((s) => s.category))).sort()];
