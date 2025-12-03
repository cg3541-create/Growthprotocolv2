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

// New types for context engineering and dual-source search
export interface OnlineSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
  image?: string | null;
  relevance: number;
}

export interface AnswerSection {
  text: string;
  sourceType: 'database' | 'online' | 'combined';
  sourceIds: string[];
}

export interface SearchResponse {
  answer: string;
  sources: {
    database: Array<{ id: string; name: string; type: string; snippet: string; relevance: number }>;
    online: OnlineSource[];
  };
  answerSections: AnswerSection[];
}

// Embedded data - working prototype
const productsData: { products: Product[] } = {
  products: [
    {
      id: "P001",
      name: "Align High-Rise Pant 25\"",
      category: "Yoga Pants",
      material: "Nulu fabric",
      price: 98,
      colors: ["Black", "Navy", "Dark Olive"],
      quarter_sales: "Q4 2025",
      status: "Bestseller",
      target_demographic: "Women 25-40",
      performance_metrics: { sales_growth: "+23%", customer_rating: 4.8 }
    },
    {
      id: "P002",
      name: "Wunder Train High-Rise Tight 25\"",
      category: "Training Tights",
      material: "Everlux fabric",
      price: 98,
      colors: ["Black", "Chambray", "Sonic Pink"],
      quarter_sales: "Q4 2025",
      status: "Bestseller",
      target_demographic: "Women 20-35",
      performance_metrics: { sales_growth: "+31%", customer_rating: 4.7 }
    },
    {
      id: "P005",
      name: "Scuba Oversized Half-Zip Hoodie",
      category: "Loungewear",
      material: "Cotton-blend fleece",
      price: 118,
      colors: ["Heathered Grey", "Black", "Pink Mist", "Lavender Dew"],
      quarter_sales: "Q4 2025",
      status: "Bestseller",
      target_demographic: "Women 18-35",
      performance_metrics: { sales_growth: "+42%", customer_rating: 4.8 }
    },
    {
      id: "P009",
      name: "Everywhere Belt Bag",
      category: "Accessories",
      material: "Water-repellent fabric",
      price: 38,
      colors: ["Black", "Navy", "Pink Pastel"],
      quarter_sales: "Q4 2025",
      status: "Bestseller",
      target_demographic: "Women 18-50",
      performance_metrics: { sales_growth: "+67%", customer_rating: 4.9 }
    }
  ]
};

const marketData: MarketData = {
  market_trends: {
    Q2_2026_emerging_trends: [
      {
        trend_name: "Sustainable Performance Fabrics",
        category: "Athletic Wear",
        growth_rate: "+45%",
        alignment_with_bestsellers: "High - aligns with Align Pant and Wunder Train success",
        priority: "High",
        consumer_demand: "Very Strong",
        notes: "Eco-conscious consumers seeking sustainable options without performance compromise"
      },
      {
        trend_name: "Hybrid Lounge-to-Street Wear",
        category: "Loungewear/Casual",
        growth_rate: "+52%",
        alignment_with_bestsellers: "Very High - directly aligns with Scuba Hoodie momentum",
        priority: "Critical",
        consumer_demand: "Extremely Strong",
        notes: "Post-pandemic lifestyle shift continues"
      },
      {
        trend_name: "High-Performance Running Gear",
        category: "Running",
        growth_rate: "+38%",
        alignment_with_bestsellers: "High - aligns with Fast and Free performance",
        priority: "High",
        consumer_demand: "Strong",
        notes: "Marathon surge driving premium gear demand"
      },
      {
        trend_name: "Minimalist Accessories",
        category: "Accessories",
        growth_rate: "+61%",
        alignment_with_bestsellers: "Very High - Everywhere Belt Bag leading this category",
        priority: "Critical",
        consumer_demand: "Extremely Strong",
        notes: "Functional, compact designs with crossbody versatility"
      }
    ],
    color_trends_spring_2026: {
      women_activewear: [
        {
          color_family: "Soft Pastels",
          specific_colors: ["Lavender Haze", "Peach Cream", "Mint Whisper", "Blush Pink"],
          trend_strength: "Very Strong",
          match_with_lululemon_q2_palette: "Partial - have Pink Mist but missing key pastels",
          recommendation: "Add 2-3 pastel options to align with market"
        },
        {
          color_family: "Earth Tones",
          specific_colors: ["Terracotta", "Sage Green", "Clay Brown", "Desert Sand"],
          trend_strength: "Strong",
          match_with_lululemon_q2_palette: "Good - Dark Olive aligns well",
          recommendation: "On track, consider expanding earth tone range"
        }
      ]
    },
    adjacent_categories_opportunity: [
      {
        category: "Technical Underwear",
        consumer_demand: "Very High",
        connection_to_bestsellers: "Supports all athletic categories",
        estimated_market_size: "$420M annually",
        cannibalization_risk: "None",
        recommendation: "Excellent opportunity - high margins, strong demand"
      },
      {
        category: "Performance Socks",
        consumer_demand: "Very High",
        connection_to_bestsellers: "Complements running tights and training wear",
        estimated_market_size: "$280M annually",
        cannibalization_risk: "None",
        recommendation: "Strong opportunity - natural extension"
      }
    ]
  },
  competitor_analysis: {
    fabric_innovations: [
      {
        competitor: "Nike",
        innovation: "Nike Dri-FIT ADV Technology",
        description: "Advanced moisture-wicking with body-mapped ventilation",
        performance_q4_2025: "Strong - featured in top 5 products",
        recommendation: "Consider accelerating body-mapped ventilation R&D"
      },
      {
        competitor: "Athleta",
        innovation: "Responsible Nylon (100% recycled)",
        description: "Fully recycled nylon with equivalent performance",
        performance_q4_2025: "Very Strong - sustainability resonating with consumers",
        recommendation: "Accelerate development - high priority for brand values"
      }
    ]
  },
  q2_launch_analysis: {}
};

const ontologyData: OntologyData = {
  ontology: {
    name: "Lululemon Retail Intelligence Ontology",
    version: "1.0",
    entities: [
      { id: "E1", type: "Products", description: "Product catalog including SKUs, categories, and performance data", attributes: ["name", "category", "material", "price", "colors", "sales_metrics"] },
      { id: "E2", type: "Materials", description: "Fabric technologies and material innovations", attributes: ["fabric_name", "properties", "sustainability_rating", "performance_metrics"] },
      { id: "E3", type: "Markets", description: "Geographic markets, consumer segments, and market trends", attributes: ["region", "demographics", "trends", "growth_rate", "preferences"] },
      { id: "E4", type: "Competitors", description: "Competitive brands and their product innovations", attributes: ["brand_name", "innovations", "market_position", "pricing_strategy"] },
      { id: "E5", type: "Customers", description: "Target demographics and customer preferences", attributes: ["age_range", "gender", "lifestyle", "purchase_behavior", "preferences"] }
    ],
    relationships: [
      { from: "Products", to: "Materials", relationship: "made_of", description: "Products are manufactured using specific materials and fabrics" },
      { from: "Products", to: "Markets", relationship: "sold_in", description: "Products are distributed and sold in specific geographic markets" },
      { from: "Products", to: "Customers", relationship: "targets", description: "Products are designed for specific customer demographics" },
      { from: "Competitors", to: "Products", relationship: "competes_with", description: "Competitor products compete with our product lines" },
      { from: "Markets", to: "Customers", relationship: "contains", description: "Markets consist of customer segments with specific characteristics" }
    ]
  }
};

// Initialize data - instant load since embedded
export async function initializeData() {
  console.log('✅ All data loaded successfully (embedded)');
  return true;
}

// Generate mock response when backend is unavailable
function generateMockResponse(query: string, context: string): string {
  const queryLower = query.toLowerCase();
  
  // Trend-related queries
  if (queryLower.includes('trend') || queryLower.includes('emerging') || queryLower.includes('q2 2026')) {
    return `Based on our Q4 2025 bestseller performance and Q2 2026 market analysis, here are the key emerging trends in athletic wear:

**1. Hybrid Lounge-to-Street Wear (+52% growth)**
This trend shows extremely strong alignment with our current bestsellers. The Scuba Oversized Half-Zip Hoodie (+42% sales growth) directly captures this momentum. The post-pandemic lifestyle shift continues, with consumers seeking versatile pieces that transition seamlessly from home to street.

**2. Sustainable Performance Fabrics (+45% growth)**
High alignment with our Align Pant (+23% growth) and Wunder Train (+31% growth) success. Eco-conscious consumers are seeking sustainable options without performance compromise. This represents a critical opportunity to expand our sustainable fabric innovations.

**3. Minimalist Accessories (+61% growth)**
Very high alignment - our Everywhere Belt Bag (+67% sales growth) is leading this category. Functional, compact designs with crossbody versatility are driving strong consumer demand.

**4. High-Performance Running Gear (+38% growth)**
Strong alignment with our performance-focused products. The marathon and outdoor running surge is driving premium gear demand.

**Recommendation:** Prioritize expanding our Hybrid Lounge-to-Street and Sustainable Performance Fabric lines, as these show the strongest alignment with our proven bestsellers and highest market growth rates.`;
  }
  
  // Product-related queries
  if (queryLower.includes('product') || queryLower.includes('bestseller') || queryLower.includes('top')) {
    return `Our Q4 2025 top performers demonstrate strong momentum across multiple categories:

**Top Bestsellers:**
1. **Everywhere Belt Bag** - +67% sales growth, 4.9 rating
   - Category: Accessories
   - Price: $38
   - Target: Women 18-50

2. **Scuba Oversized Half-Zip Hoodie** - +42% sales growth, 4.8 rating
   - Category: Loungewear
   - Price: $118
   - Target: Women 18-35

3. **Wunder Train High-Rise Tight** - +31% sales growth, 4.7 rating
   - Category: Training Tights
   - Price: $98
   - Target: Women 20-35

4. **Align High-Rise Pant** - +23% sales growth, 4.8 rating
   - Category: Yoga Pants
   - Price: $98
   - Target: Women 25-40

**Key Insights:**
- Accessories show exceptional growth potential
- Loungewear category demonstrates strong consumer demand
- Performance wear maintains consistent high ratings
- Price points between $38-$118 show strong performance across demographics`;
  }
  
  // Competitor-related queries
  if (queryLower.includes('competitor') || queryLower.includes('innovation') || queryLower.includes('fabric')) {
    return `Competitor fabric innovation analysis for Q4 2025:

**Key Innovations:**
1. **Nike Dri-FIT ADV Technology** - Strong performance
   - Advanced moisture-wicking with body-mapped ventilation
   - Our equivalent: Everlux (similar but less body-mapping)
   - Recommendation: Consider accelerating body-mapped ventilation R&D

2. **Athleta Responsible Nylon (100% recycled)** - Very strong performance
   - Fully recycled nylon with equivalent performance
   - High priority for brand values alignment
   - Recommendation: Accelerate development (4-6 month timeline)

3. **Alo Yoga Airlift Fabric** - Extremely strong performance
   - Cloud-like soft with high compression and smoothing
   - Our equivalent: Nulu (different properties - less compression)
   - Recommendation: Consider soft-compression hybrid development

**Strategic Focus:** Sustainability innovations show the strongest consumer resonance, making Athleta's Responsible Nylon approach a high-priority development area.`;
  }
  
  // Default response
  return `Based on our comprehensive data analysis:

**Current Performance:**
- 4 bestsellers showing strong Q4 2025 momentum
- Multiple categories demonstrating growth (Accessories +67%, Loungewear +42%, Training +31%)
- High customer satisfaction ratings (4.7-4.9 average)

**Market Opportunities:**
- Q2 2026 trends show strong alignment with our bestseller portfolio
- Sustainable performance fabrics represent a high-growth opportunity
- Hybrid lounge-to-street wear continues to gain momentum

**Recommendations:**
1. Expand successful categories (Accessories, Loungewear)
2. Accelerate sustainable fabric innovation
3. Leverage bestseller momentum for Q2 2026 launches

For more specific insights, please ask about trends, products, competitors, or market analysis.`;
}

// Prepare context based on user query
function prepareContext(query: string): string {
  const queryLower = query.toLowerCase();
  let context = '';
  
  const needsProducts = queryLower.includes('product') || queryLower.includes('bestseller') || queryLower.includes('top');
  const needsTrends = queryLower.includes('trend') || queryLower.includes('emerging') || queryLower.includes('q2 2026');
  const needsColors = queryLower.includes('color') || queryLower.includes('pattern') || queryLower.includes('spring');
  const needsFabrics = queryLower.includes('fabric') || queryLower.includes('material') || queryLower.includes('innovation');
  const needsCategories = queryLower.includes('adjacent') || queryLower.includes('categor') || queryLower.includes('opportunity');
  
  if (needsProducts) {
    context += '\n=== TOP PRODUCTS (Q4 2025) ===\n';
    context += JSON.stringify(productsData.products, null, 2);
  }
  
  if (needsTrends) {
    context += '\n\n=== EMERGING TRENDS (Q2 2026) ===\n';
    context += JSON.stringify(marketData.market_trends.Q2_2026_emerging_trends, null, 2);
  }
  
  if (needsColors) {
    context += '\n\n=== COLOR TRENDS (SPRING 2026) ===\n';
    context += JSON.stringify(marketData.market_trends.color_trends_spring_2026, null, 2);
  }
  
  if (needsFabrics) {
    context += '\n\n=== COMPETITOR FABRIC INNOVATIONS ===\n';
    context += JSON.stringify(marketData.competitor_analysis.fabric_innovations, null, 2);
  }
  
  if (needsCategories) {
    context += '\n\n=== ADJACENT CATEGORY OPPORTUNITIES ===\n';
    context += JSON.stringify(marketData.market_trends.adjacent_categories_opportunity, null, 2);
  }
  
  if (!context) {
    context = '\n=== AVAILABLE DATA ===\n';
    context += JSON.stringify({ 
      top_products: productsData.products.slice(0, 3),
      key_trends: marketData.market_trends.Q2_2026_emerging_trends.slice(0, 2)
    }, null, 2);
  }
  
  return context;
}

// Send message to Claude API via backend server
export async function sendMessageToClaude(userMessage: string): Promise<string> {
  const context = prepareContext(userMessage);
  
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

  const fullContext = systemPrompt + '\n\nContext Data:\n' + context + '\n\nUser Question: ' + userMessage + '\n\nProvide a detailed, strategic answer based ONLY on the data above.';

  try {
    // Call our backend server instead of Claude API directly
    const response = await fetch('http://localhost:4000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        context: fullContext
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.response;
    
  } catch (error) {
    console.error('Error calling backend:', error);
    // Fallback: Provide intelligent mock response based on available data
    return generateMockResponse(userMessage, context);
  }
}

// Send message with context engineering (dual-source search)
export async function sendMessageWithContextEngineering(userMessage: string): Promise<SearchResponse> {
  // Prepare database data to send to backend
  const queryLower = userMessage.toLowerCase();
  const databaseData: any = {};
  
  // Extract relevant data based on query - always include relevant data
  if (queryLower.includes('product') || queryLower.includes('bestseller') || queryLower.includes('sales')) {
    databaseData.products = productsData.products;
  }
  
  if (queryLower.includes('trend') || queryLower.includes('emerging') || queryLower.includes('market') || queryLower.includes('q2')) {
    databaseData.marketTrends = marketData.market_trends.Q2_2026_emerging_trends;
  }
  
  if (queryLower.includes('fabric') || queryLower.includes('material') || queryLower.includes('innovation') || queryLower.includes('competitor')) {
    databaseData.competitorAnalysis = marketData.competitor_analysis.fabric_innovations;
  }
  
  // Always include some data to ensure we have database sources
  if (!databaseData.products) databaseData.products = productsData.products;
  if (!databaseData.marketTrends) databaseData.marketTrends = marketData.market_trends.Q2_2026_emerging_trends;
  if (!databaseData.competitorAnalysis && queryLower.includes('competitor')) {
    databaseData.competitorAnalysis = marketData.competitor_analysis.fabric_innovations;
  }

  console.log('🔍 Calling context engineering API with query:', userMessage);
  console.log('📊 Database data being sent:', Object.keys(databaseData));

  try {
    const response = await fetch('http://localhost:4000/api/analyze-and-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        databaseData: databaseData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend error:', errorData);
      throw new Error(`Backend Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('✅ Context engineering response:', {
      hasAnswer: !!data.answer,
      databaseSources: data.sources?.database?.length || 0,
      onlineSources: data.sources?.online?.length || 0
    });
    return data as SearchResponse;
    
  } catch (error) {
    console.error('❌ Error calling analyze-and-search:', error);
    // Fallback: use old method but return in new format with database sources
    try {
      const fallbackAnswer = await sendMessageToClaude(userMessage);
      // Convert old sources to new format
      const fallbackSources = convertToSources([
        { name: "products.json", type: "Product Data" },
        { name: "market_data.json", type: "Market Trends" },
        { name: "ontology.json", type: "Knowledge Graph" }
      ]);
      
      return {
        answer: fallbackAnswer,
        sources: {
          database: fallbackSources.map((src, idx) => ({
            id: src.id,
            name: src.title,
            type: src.type,
            snippet: src.snippet,
            relevance: src.relevance
          })),
          online: []
        },
        answerSections: [
          { text: fallbackAnswer, sourceType: 'database', sourceIds: fallbackSources.map(s => s.id) }
        ]
      };
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      // Ultimate fallback with at least database sources
      const ultimateSources = [
        { name: "products.json", type: "Product Data" },
        { name: "market_data.json", type: "Market Trends" }
      ];
      return {
        answer: 'Sorry, I encountered an error processing your request. Please check your API key configuration and try again.',
        sources: {
          database: ultimateSources.map((src, idx) => ({
            id: `db-${idx + 1}`,
            name: src.name,
            type: 'database',
            snippet: `${src.type} containing relevant information.`,
            relevance: 0.8
          })),
          online: []
        },
        answerSections: [
          { text: 'Error occurred', sourceType: 'combined', sourceIds: [] }
        ]
      };
    }
  }
}

// Helper to convert sources for fallback
function convertToSources(dataSources: Array<{ name: string; type: string }>): Source[] {
  return dataSources.map((source, index) => {
    const isJson = source.name.endsWith('.json');
    const type = isJson ? 'database' : 'paper';
    
    let snippet = '';
    if (source.name.includes('products')) {
      snippet = 'Product catalog data including SKUs, categories, pricing, and sales performance metrics.';
    } else if (source.name.includes('market')) {
      snippet = 'Market trends and analysis data including growth rates, consumer preferences, and competitive intelligence.';
    } else if (source.name.includes('ontology')) {
      snippet = 'Knowledge graph structure defining entity relationships, attributes, and semantic connections.';
    } else {
      snippet = `${source.type || 'Data source'} containing relevant information for analysis.`;
    }

    return {
      id: String(index + 1),
      title: source.name,
      type: type,
      snippet: snippet,
      relevance: 0.9 - (index * 0.05),
      url: '#',
    };
  });
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