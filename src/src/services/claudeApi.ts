// Claude API Service for Growth Protocol - Lululemon Demo

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Import data types
interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  price: number;
  colors: string[];
  quarter_sales: string;
  status: string;
  target_demographic: string;
  performance_metrics: {
    sales_growth: string;
    customer_rating: number;
  };
}

interface MarketData {
  market_trends: any;
  competitor_analysis: any;
  q2_launch_analysis: any;
}

interface OntologyData {
  ontology: {
    name: string;
    version: string;
    entities: any[];
    relationships: any[];
  };
}

// Load data files
let productsData: { products: Product[] } | null = null;
let marketData: MarketData | null = null;
let ontologyData: OntologyData | null = null;

// Initialize data loading
export async function initializeData() {
  try {
    const [products, market, ontology] = await Promise.all([
      fetch('/src/data/products.json').then(r => r.json()),
      fetch('/src/data/market_data.json').then(r => r.json()),
      fetch('/src/data/ontology.json').then(r => r.json())
    ]);
    
    productsData = products;
    marketData = market;
    ontologyData = ontology;
    
    console.log('✅ All data loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error loading data:', error);
    return false;
  }
}

// Prepare context based on user query
function prepareContext(query: string): string {
  const queryLower = query.toLowerCase();
  let context = '';
  
  // Determine what data is relevant
  const needsProducts = queryLower.includes('product') || queryLower.includes('bestseller') || queryLower.includes('top 10');
  const needsTrends = queryLower.includes('trend') || queryLower.includes('emerging') || queryLower.includes('q2 2026');
  const needsColors = queryLower.includes('color') || queryLower.includes('pattern') || queryLower.includes('spring');
  const needsFabrics = queryLower.includes('fabric') || queryLower.includes('material') || queryLower.includes('innovation');
  const needsCategories = queryLower.includes('adjacent') || queryLower.includes('categor') || queryLower.includes('opportunity');
  const needsCannibalization = queryLower.includes('cannibal') || queryLower.includes('launch') || queryLower.includes('conflict');
  
  // Add relevant data
  if (needsProducts && productsData) {
    context += '\n=== TOP PRODUCTS (Q4 2025) ===\n';
    context += JSON.stringify(productsData.products, null, 2);
  }
  
  if (needsTrends && marketData) {
    context += '\n\n=== EMERGING TRENDS (Q2 2026) ===\n';
    context += JSON.stringify(marketData.market_trends.Q2_2026_emerging_trends, null, 2);
  }
  
  if (needsColors && marketData) {
    context += '\n\n=== COLOR & PATTERN TRENDS (SPRING 2026) ===\n';
    context += JSON.stringify(marketData.market_trends.color_trends_spring_2026, null, 2);
  }
  
  if (needsFabrics && marketData) {
    context += '\n\n=== COMPETITOR FABRIC INNOVATIONS ===\n';
    context += JSON.stringify(marketData.competitor_analysis.fabric_innovations, null, 2);
  }
  
  if (needsCategories && marketData) {
    context += '\n\n=== ADJACENT CATEGORY OPPORTUNITIES ===\n';
    context += JSON.stringify(marketData.market_trends.adjacent_categories_opportunity, null, 2);
  }
  
  if (needsCannibalization && marketData) {
    context += '\n\n=== Q2 LAUNCH CANNIBALIZATION ANALYSIS ===\n';
    context += JSON.stringify(marketData.q2_launch_analysis, null, 2);
  }
  
  // If no specific match, include key data
  if (!context && productsData && marketData) {
    context = '\n=== AVAILABLE DATA ===\n';
    context += JSON.stringify({ 
      top_products: productsData.products.slice(0, 5),
      key_trends: marketData.market_trends.Q2_2026_emerging_trends.slice(0, 3)
    }, null, 2);
  }
  
  return context;
}

// Send message to Claude API
export async function sendMessageToClaude(userMessage: string): Promise<string> {
  // Check if API key is set
  if (!CLAUDE_API_KEY || CLAUDE_API_KEY === '') {
    return '⚠️ **API Key Not Set**\n\nTo use Zeus AI:\n1. Get your Claude API key from console.anthropic.com\n2. Add it to your .env file as VITE_CLAUDE_API_KEY\n3. Restart your development server\n\nFor now, here\'s a demo response based on your question! 😊';
  }
  
  // Prepare context from data
  const context = prepareContext(userMessage);
  
  // Create system prompt
  const systemPrompt = `You are Zeus AI, Lululemon's intelligent business assistant powered by Growth Protocol's neurosymbolic AI platform.

You have access to:
- Complete product catalog with Q4 2025 bestsellers
- Market trends and competitor analysis for Q2 2026
- Knowledge graph ontology of the retail business

Your responses must be:
1. Based ONLY on the provided data (zero hallucinations)
2. Strategic and actionable for business decisions
3. Professional yet conversational
4. Cite specific data points and metrics

Remember: Your data is secure and never shared with external LLMs thanks to context engineering.`;

  const userPrompt = `Context Data:
${context}

User Question: ${userMessage}

Provide a detailed, strategic answer based ONLY on the data above. Include specific metrics and actionable recommendations.`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: systemPrompt + '\n\n' + userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.content[0].text;
    
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

// Get ontology data for visualization
export function getOntologyData() {
  return ontologyData;
}

// Get all products
export function getProducts() {
  return productsData?.products || [];
}

// Get market trends
export function getMarketTrends() {
  return marketData?.market_trends || null;
}
