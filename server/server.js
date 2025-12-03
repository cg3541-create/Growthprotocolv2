const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Analyze query to separate private vs public search needs
async function analyzeQuery(userQuery, CLAUDE_API_KEY) {
  const analysisPrompt = `Analyze this business query and determine:

1. What information can be answered from a private database containing:
   - Product catalog (names, prices, sales data, materials)
   - Market trends and competitor analysis
   - Internal business metrics

2. What information requires public web search (general industry trends, competitor public information, market research, fabric innovations, competitor products, industry news)

IMPORTANT: If the query asks about:
- "competitor products" or "competitor innovations" → REQUIRES ONLINE SEARCH
- "fabric innovations" or "material innovations" → REQUIRES ONLINE SEARCH  
- "gaining traction" or "trending" → REQUIRES ONLINE SEARCH
- "industry trends" or "market trends" → REQUIRES ONLINE SEARCH
- Questions about what competitors are doing → REQUIRES ONLINE SEARCH

3. Create a SANITIZED search query for web search that:
   - Removes company names (replace with generic terms like "athletic wear company")
   - Removes proprietary product names
   - Removes internal metrics and specific data
   - Keeps only general industry terms and concepts

4. Return a JSON object with this structure:
{
  "databaseNeeds": ["list of what needs database"],
  "onlineNeeds": ["list of what needs web search"],
  "sanitizedQuery": "general search query without private details",
  "requiresDatabase": true/false,
  "requiresOnline": true/false
}

User Query: "${userQuery}"

Respond ONLY with valid JSON, no additional text.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Claude API error in analysis');
    }

    const data = await response.json();
    const analysisText = data.content[0].text;
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: return default structure based on query content
    const queryLower = userQuery.toLowerCase();
    const needsOnline = queryLower.includes('competitor') || 
                       queryLower.includes('innovation') || 
                       queryLower.includes('fabric') || 
                       queryLower.includes('traction') ||
                       queryLower.includes('trending') ||
                       queryLower.includes('industry trend');
    
    return {
      databaseNeeds: needsOnline ? [] : [userQuery],
      onlineNeeds: needsOnline ? [userQuery] : [],
      sanitizedQuery: userQuery.replace(/\b(our|my|company|internal)\b/gi, '').trim() || userQuery,
      requiresDatabase: !needsOnline,
      requiresOnline: needsOnline
    };
  } catch (error) {
    console.error('Error analyzing query:', error);
    // Fallback: check query content to determine if online search is needed
    const queryLower = userQuery.toLowerCase();
    const needsOnline = queryLower.includes('competitor') || 
                       queryLower.includes('innovation') || 
                       queryLower.includes('fabric') || 
                       queryLower.includes('traction') ||
                       queryLower.includes('trending') ||
                       queryLower.includes('industry trend');
    
    return {
      databaseNeeds: needsOnline ? [] : [userQuery],
      onlineNeeds: needsOnline ? [userQuery] : [],
      sanitizedQuery: userQuery.replace(/\b(our|my|company|internal)\b/gi, '').trim() || userQuery,
      requiresDatabase: !needsOnline,
      requiresOnline: needsOnline
    };
  }
}

// Search private database (simplified - would need actual database connection)
async function searchDatabase(query, databaseData) {
  // This is a placeholder - in production, this would query an actual database
  // For now, we'll return the database data that was passed in
  const queryLower = query.toLowerCase();
  
  const sources = [];
  let context = '';
  
  // Determine what data is needed
  const needsProducts = queryLower.includes('product') || queryLower.includes('bestseller') || queryLower.includes('sales');
  const needsTrends = queryLower.includes('trend') || queryLower.includes('emerging') || queryLower.includes('market');
  const needsFabrics = queryLower.includes('fabric') || queryLower.includes('material') || queryLower.includes('innovation') || queryLower.includes('competitor');
  const needsColors = queryLower.includes('color') || queryLower.includes('pattern');
  const needsCategories = queryLower.includes('adjacent') || queryLower.includes('categor') || queryLower.includes('opportunity');
  
  if (needsProducts && databaseData.products) {
    sources.push({
      id: 'db-products',
      name: 'products.json',
      type: 'database',
      snippet: 'Product catalog data including SKUs, categories, pricing, and sales performance metrics.',
      relevance: 0.9
    });
    context += '\n=== PRODUCTS ===\n' + JSON.stringify(databaseData.products, null, 2);
  }
  
  if (needsTrends && databaseData.marketTrends) {
    sources.push({
      id: 'db-trends',
      name: 'market_data.json',
      type: 'database',
      snippet: 'Market trends and analysis data including growth rates and competitive intelligence.',
      relevance: 0.85
    });
    context += '\n=== MARKET TRENDS ===\n' + JSON.stringify(databaseData.marketTrends, null, 2);
  }
  
  if (needsFabrics && databaseData.competitorAnalysis) {
    sources.push({
      id: 'db-fabrics',
      name: 'market_data.json',
      type: 'database',
      snippet: 'Competitor fabric innovations and material analysis.',
      relevance: 0.88
    });
    context += '\n=== COMPETITOR FABRICS ===\n' + JSON.stringify(databaseData.competitorAnalysis, null, 2);
  }
  
  // If no specific match, include all available data
  if (!context && databaseData) {
    if (databaseData.products) {
      sources.push({
        id: 'db-products',
        name: 'products.json',
        type: 'database',
        snippet: 'Product catalog data.',
        relevance: 0.8
      });
      context += '\n=== PRODUCTS ===\n' + JSON.stringify(databaseData.products.slice(0, 5), null, 2);
    }
    if (databaseData.marketTrends) {
      sources.push({
        id: 'db-trends',
        name: 'market_data.json',
        type: 'database',
        snippet: 'Market trends data.',
        relevance: 0.75
      });
      context += '\n=== MARKET TRENDS ===\n' + JSON.stringify(databaseData.marketTrends.slice(0, 3), null, 2);
    }
  }
  
  return { sources, context };
}

// Claude-based web search function (for demo purposes)
async function searchOnline(query, CLAUDE_API_KEY) {
  console.log('🌐 Using Claude for online search with query:', query);

  try {
    // Use Claude to generate a web-search-like response
    const searchPrompt = `You are a web research assistant. Based on current industry knowledge and trends (as of 2024-2025), provide a comprehensive answer to this question as if you searched the web and found multiple sources.

Question: ${query}

Requirements:
1. Provide a detailed, informative answer based on general industry knowledge
2. Write as if you found this information from multiple web sources
3. Include specific details, statistics, and examples where relevant
4. Make it sound like you researched recent articles, reports, and industry publications
5. Keep the tone professional and informative

Format your response naturally, as if summarizing findings from web research.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
            content: searchPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Claude API error in web search');
    }

    const data = await response.json();
    const answer = data.content[0].text;
    
    // Generate realistic mock sources based on the query
    const sources = generateMockSources(query);
    
    console.log('✅ Claude web search completed:', {
      answerLength: answer.length,
      sourcesCount: sources.length,
      hasAnswer: !!answer
    });
    
    return { sources, answer };
  } catch (error) {
    console.error('❌ Claude web search error:', {
      message: error.message
    });
    return { sources: [], answer: '' };
  }
}

// Generate realistic mock sources for demo purposes
function generateMockSources(query) {
  const queryLower = query.toLowerCase();
  const sources = [];
  
  // Generate 3-5 relevant mock sources based on query topic
  const baseSources = [
    {
      id: 'online-1',
      title: 'Industry Trends Report 2024',
      url: 'https://example.com/industry-trends-2024',
      snippet: 'Comprehensive analysis of current market trends and industry developments.',
      relevance: 0.9
    },
    {
      id: 'online-2',
      title: 'Market Research Insights',
      url: 'https://example.com/market-research',
      snippet: 'Latest market research data and consumer behavior insights.',
      relevance: 0.85
    },
    {
      id: 'online-3',
      title: 'Competitive Intelligence Brief',
      url: 'https://example.com/competitive-intel',
      snippet: 'Analysis of competitor strategies and market positioning.',
      relevance: 0.8
    }
  ];
  
  // Add topic-specific sources
  if (queryLower.includes('fabric') || queryLower.includes('material') || queryLower.includes('innovation')) {
    sources.push({
      id: 'online-4',
      title: 'Textile Innovation Journal',
      url: 'https://example.com/textile-innovation',
      snippet: 'Latest developments in fabric technology and material science.',
      relevance: 0.88
    });
  }
  
  if (queryLower.includes('athletic') || queryLower.includes('sportswear') || queryLower.includes('activewear')) {
    sources.push({
      id: 'online-5',
      title: 'Athletic Wear Industry Report',
      url: 'https://example.com/athletic-wear-report',
      snippet: 'Comprehensive analysis of the athletic wear and sportswear market.',
      relevance: 0.87
    });
  }
  
  if (queryLower.includes('social media') || queryLower.includes('trending')) {
    sources.push({
      id: 'online-6',
      title: 'Social Media Trends Analysis',
      url: 'https://example.com/social-trends',
      snippet: 'Current social media trends and consumer sentiment analysis.',
      relevance: 0.86
    });
  }
  
  // Combine base sources with topic-specific ones
  return [...baseSources, ...sources].slice(0, 5);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// New endpoint: Analyze query and search both database and online
app.post('/api/analyze-and-search', async (req, res) => {
  const { message, databaseData } = req.body;
  const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY;
  
  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'Claude API key not configured' });
  }

  try {
    console.log('🔍 Starting analyze-and-search for query:', message);
    
    // Step 1: Analyze query to determine what needs database vs online search
    const analysis = await analyzeQuery(message, CLAUDE_API_KEY);
    
    console.log('📊 Query analysis result:', {
      requiresDatabase: analysis.requiresDatabase,
      requiresOnline: analysis.requiresOnline,
      sanitizedQuery: analysis.sanitizedQuery,
      databaseNeeds: analysis.databaseNeeds,
      onlineNeeds: analysis.onlineNeeds
    });
    
    let databaseResult = { sources: [], context: '', answer: '' };
    let onlineResult = { sources: [], answer: '' };
    
    // Step 2: Search database if needed
    if (analysis.requiresDatabase && databaseData) {
      console.log('📂 Searching database...');
      databaseResult = await searchDatabase(message, databaseData);
      console.log('📂 Database search result:', {
        sourcesCount: databaseResult.sources.length,
        hasContext: !!databaseResult.context,
        sourceNames: databaseResult.sources.map(s => s.name)
      });
      
      // Generate answer from database data using Claude
      if (databaseResult.context) {
        const dbPrompt = `Based on this private database data, answer the user's question. 
Do NOT mention specific company names, product names, or internal metrics in a way that could identify the company.
Focus on insights and recommendations.

Database Context:
${databaseResult.context}

User Question: ${message}

Provide a detailed answer based on the database data.`;

        const dbResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            messages: [{ role: 'user', content: dbPrompt }]
          })
        });
        
        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          databaseResult.answer = dbData.content[0].text;
        }
      }
    }
    
    // Step 3: Search online if needed (using Claude)
    if (analysis.requiresOnline && analysis.sanitizedQuery) {
      console.log('🌐 Searching online with query:', analysis.sanitizedQuery);
      onlineResult = await searchOnline(analysis.sanitizedQuery, CLAUDE_API_KEY);
      console.log('🌐 Online search result:', {
        hasAnswer: !!onlineResult.answer,
        sourcesCount: onlineResult.sources.length
      });
    } else {
      console.log('⚠️ Skipping online search - requiresOnline:', analysis.requiresOnline, 'sanitizedQuery:', analysis.sanitizedQuery);
    }
    
    // Step 4: Combine answers if both sources were used
    let combinedAnswer = '';
    const answerSections = [];
    
    if (databaseResult.answer && onlineResult.answer) {
      // Use Claude to combine the answers
      const combinePrompt = `Combine these two answers into one cohesive response. 
The first answer is from a private database, the second is from public web research.
Create a unified answer that flows naturally and cites sources appropriately.

Database Answer:
${databaseResult.answer}

Online Research Answer:
${onlineResult.answer}

User's Original Question: ${message}

IMPORTANT: When writing the combined answer, you MUST clearly mark which parts come from which source:
- Use [DB] at the START of any sentence or paragraph that uses information from the database
- Use [Online] at the START of any sentence or paragraph that uses information from the online research
- You can use these markers multiple times throughout your answer
- Make sure every piece of information is clearly attributed

Example format:
[DB] Based on our internal data, sales have increased by 23%.
[Online] According to recent industry reports, fabric innovations are gaining traction in the market.

Provide a combined, cohesive answer that integrates both sources with clear attribution.`;

      const combineResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{ role: 'user', content: combinePrompt }]
        })
      });
      
      if (combineResponse.ok) {
        const combineData = await combineResponse.json();
        combinedAnswer = combineData.content[0].text;
        
        // Parse answer to identify sections
        const sections = combinedAnswer.split(/(\[DB\]|\[Online\])/);
        let currentSection = { text: '', sourceType: 'combined', sourceIds: [] };
        
        sections.forEach((part, index) => {
          if (part === '[DB]') {
            if (currentSection.text) answerSections.push(currentSection);
            currentSection = { text: '', sourceType: 'database', sourceIds: databaseResult.sources.map(s => s.id) };
          } else if (part === '[Online]') {
            if (currentSection.text) answerSections.push(currentSection);
            currentSection = { text: '', sourceType: 'online', sourceIds: onlineResult.sources.map(s => s.id) };
          } else {
            currentSection.text += part;
          }
        });
        if (currentSection.text) answerSections.push(currentSection);
      } else {
        // Fallback: simple concatenation
        combinedAnswer = `${databaseResult.answer}\n\n---\n\nAdditional Research:\n${onlineResult.answer}`;
        answerSections.push(
          { text: databaseResult.answer, sourceType: 'database', sourceIds: databaseResult.sources.map(s => s.id) },
          { text: onlineResult.answer, sourceType: 'online', sourceIds: onlineResult.sources.map(s => s.id) }
        );
      }
    } else if (databaseResult.answer) {
      combinedAnswer = databaseResult.answer;
      answerSections.push({
        text: databaseResult.answer,
        sourceType: 'database',
        sourceIds: databaseResult.sources.map(s => s.id)
      });
    } else if (databaseResult.sources.length > 0) {
      // Database was searched and has sources, but no answer generated
      // Still include the sources in the response
      combinedAnswer = 'I found relevant information in your database, but was unable to generate a complete answer. Please try rephrasing your question.';
      answerSections.push({
        text: combinedAnswer,
        sourceType: 'database',
        sourceIds: databaseResult.sources.map(s => s.id)
      });
    } else if (onlineResult.answer) {
      // If only online results, mark the entire answer as online
      combinedAnswer = `[Online] ${onlineResult.answer}`;
      answerSections.push({
        text: onlineResult.answer,
        sourceType: 'online',
        sourceIds: onlineResult.sources.map(s => s.id)
      });
      // Still include database sources if they were searched (even if no answer generated)
      if (databaseResult.sources.length > 0) {
        // Database was searched but no answer generated, still include sources
      }
    } else {
      // No answer generated - this shouldn't happen, but handle gracefully
      combinedAnswer = 'I apologize, but I was unable to generate a response. Please try rephrasing your question.';
      answerSections.push({
        text: combinedAnswer,
        sourceType: 'combined',
        sourceIds: []
      });
    }
    
    // Step 5: Return structured response
    const response = {
      answer: combinedAnswer,
      sources: {
        database: databaseResult.sources || [],
        online: onlineResult.sources || []
      },
      answerSections: answerSections.length > 0 ? answerSections : [
        { text: combinedAnswer, sourceType: 'combined', sourceIds: [] }
      ]
    };
    
    console.log('📤 Sending response:', {
      hasAnswer: !!response.answer,
      databaseSources: response.sources.database.length,
      onlineSources: response.sources.online.length,
      answerLength: response.answer.length
    });
    
    res.json(response);
    
  } catch (error) {
    console.error('Error in analyze-and-search:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate action plan from answer
app.post('/api/generate-action-plan', async (req, res) => {
  const { answer } = req.body;
  const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY;
  
  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'Claude API key not configured' });
  }

  const planPrompt = `Based on this business analysis answer, create a structured action plan with:
1. A brief summary (1-2 sentences)
2. 3-5 specific action items, each with:
   - Title
   - Description
   - Required agent type (e.g., "Research Agent", "Strategy Agent", "Data Analysis Agent")
   - Priority (high/medium/low)
   - Estimated time
3. An execution workflow showing the order of steps and dependencies

Answer to analyze:
${answer}

Return ONLY valid JSON in this exact format:
{
  "summary": "brief summary",
  "actions": [
    {
      "id": "1",
      "title": "Action title",
      "description": "Action description",
      "agent": "Agent type",
      "priority": "high|medium|low",
      "estimatedTime": "X hours"
    }
  ],
  "workflow": {
    "steps": [
      {
        "agent": "Agent name",
        "action": "What the agent does",
        "dependencies": ["list of dependent step agents"]
      }
    ]
  }
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: planPrompt }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate plan');
    }

    const data = await response.json();
    const planText = data.content[0].text;
    
    // Extract JSON from response
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const plan = JSON.parse(jsonMatch[0]);
      res.json({ plan });
    } else {
      throw new Error('Invalid plan format');
    }
  } catch (error) {
    console.error('Error generating action plan:', error);
    res.status(500).json({ error: error.message });
  }
});

// Claude API proxy endpoint (kept for backward compatibility)
app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;
  
  const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY;
  
  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
            content: context + '\n\n' + message
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    res.json({ response: data.content[0].text });
    
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`✅ API key loaded: ${process.env.VITE_CLAUDE_API_KEY ? 'Yes' : 'No'}`);
});