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