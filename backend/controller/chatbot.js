const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const router = express.Router();

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY not found in environment variables");
  console.error("Please create a .env file with your API key");
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure generation parameters - optimized for service descriptions
const getConfig = (configOverrides = {}) => {
  return {
    temperature: configOverrides.temperature || 0.4, // Lower temperature for more consistent service info
    topK: configOverrides.topK || 40,
    topP: configOverrides.topP || 0.85,
    maxOutputTokens: configOverrides.maxOutputTokens || 1024,
  };
};

// Safety settings configuration
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
];

// Enhanced system prompt specifically for TradEX services
const systemPrompt = 
`You are the official AI assistant for TradEX, a leading service provider platform.

PLATFORM INFORMATION:
- TradEX connects customers with trusted service providers across various industries.
- We specialize in home services, professional services, and business solutions.
- Our platform ensures quality, reliability, and customer satisfaction.

RESPONSE GUIDELINES:
1. Be professional and friendly when describing our services.
2. Keep responses concise (2-3 paragraphs maximum).
3. Highlight the benefits and outcomes of using TradEX services.
4. Use persuasive but honest language.
5. Always suggest relevant services based on user queries.
6. Include a call-to-action in your responses when appropriate.
7. When describing specific services, mention: what problem it solves, who it's for, and expected outcomes.
8. If asked about pricing, provide general ranges if available but suggest contacting our support team for exact quotes.
9. If you don't know specific service details, acknowledge this and offer to connect the user with a specialist.

TONE:
- Professional yet approachable.
- Confident but not pushy.
- Helpful and solution-oriented.

TOPICS TO AVOID:
- Competitor comparisons unless specifically asked.
- Guarantees about results or outcomes.
- Personal opinions about services.
`;

// Main chat endpoint
router.post("/chat", async (req, res) => {
  try {
    // Validate API key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API key not configured. Check server setup.");
    }
    
    const { 
      message, 
      chatHistory = [], 
      serviceContext = null, 
      configOverrides = {} 
    } = req.body;

    // Select the appropriate model with fallback logic
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    } catch (e) {
      console.log("Falling back to gemini-pro model:", e.message);
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    // Build the context for the current request
    let currentPrompt = message;
    
    // Add service-specific context if provided
    if (serviceContext) {
      currentPrompt = `[Context about ${serviceContext.name}]: ${serviceContext.description}\n\nUser inquiry: ${message}`;
    }
    
    // Add system prompt
    const fullPrompt = systemPrompt + "\n\nUser message: " + currentPrompt;
    
    if (chatHistory.length === 0) {
      // FIXED: For first message, use simple generateContent instead of chat
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: getConfig(configOverrides),
        safetySettings: safetySettings, // Moved safetySettings to the root level
      });
      
      const responseText = result.response.text();
      const enhancedResponse = addResponseEnhancements(responseText, serviceContext);
      
      return res.json({ 
        reply: enhancedResponse,
        modelUsed: model.modelName,
        timestamp: new Date().toISOString()
      });
    } else {
      // FIXED: For subsequent messages, properly format history for the Gemini API
      // Format history correctly - ensure first message is from user
      const formattedHistory = [];
      
      // Always start with a user message
      if (chatHistory[0].sender !== "user") {
        // If first message isn't from user, add a dummy user message first
        formattedHistory.push({
          role: "user",
          parts: [{ text: "Hello" }]
        });
      }
      
      // Add the rest of the history with proper alternating roles
      let previousRole = formattedHistory.length > 0 ? "user" : null;
      
      for (const msg of chatHistory) {
        const currentRole = msg.sender === "user" ? "user" : "model";
        
        // Skip if we would have two of the same roles in a row
        if (currentRole === previousRole) {
          console.log("Skipping consecutive message with same role");
          continue;
        }
        
        formattedHistory.push({
          role: currentRole,
          parts: [{ text: msg.text }]
        });
        
        previousRole = currentRole;
      }
      
      // Ensure we don't end with a model message (which would cause the error)
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === "model") {
        // Remove the last model message to avoid the error
        formattedHistory.pop();
      }
      
      // Create the chat session
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: getConfig(configOverrides),
        safetySettings: safetySettings, // Moved safetySettings to the root level
      });
      
      // Send the message to Gemini
      const result = await chat.sendMessage(currentPrompt);
      
      // Process the response
      const responseText = result.response.text();
      
      // Post-process response if needed
      const enhancedResponse = addResponseEnhancements(responseText, serviceContext);
      
      // Track analytics if needed
      logInteraction(message, enhancedResponse, serviceContext?.name);
      
      res.json({ 
        reply: enhancedResponse,
        modelUsed: model.modelName,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error("Error with Gemini API:", error);
    
    // If this is the specific error we're addressing, use the simple API instead
    if (error.message.includes("First content should be with role 'user'")) {
      return handleSimpleRequest(req, res);
    }
    
    // Handle potential model errors with intelligent fallbacks
    if (error.status === 404 && error.message.includes("model")) {
      return handleModelFallback(req, res, error);
    }
    
    // If quota exceeded, provide specific message
    if (error.message.includes("quota") || error.status === 429) {
      return res.status(429).json({
        error: "Our AI service is currently at capacity. Please try again in a few minutes.",
        errorCode: "QUOTA_EXCEEDED"
      });
    }
    
    res.status(500).json({
      error: "We encountered an issue with our AI assistant. Please try again.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Fallback to simple request when chat fails
async function handleSimpleRequest(req, res) {
  try {
    const { message, serviceContext = null, configOverrides = {} } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    let currentPrompt = message;
    
    // Add service-specific context if provided
    if (serviceContext) {
      currentPrompt = `[Context about ${serviceContext.name}]: ${serviceContext.description}\n\nUser inquiry: ${message}`;
    }
    
    // Add system prompt
    const fullPrompt = systemPrompt + "\n\nUser message: " + currentPrompt;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: getConfig(configOverrides),
      safetySettings: safetySettings, // Moved safetySettings to the root level
    });
    
    const responseText = result.response.text();
    const enhancedResponse = addResponseEnhancements(responseText, serviceContext);
    
    return res.json({ 
      reply: enhancedResponse,
      modelUsed: "gemini-pro-simple",
      timestamp: new Date().toISOString()
    });
  } catch (fallbackError) {
    console.error("Simple request fallback also failed:", fallbackError);
    return res.status(500).json({
      error: "Our AI assistant is currently unavailable. Please try again later.",
      errorCode: "SIMPLE_REQUEST_FAILED"
    });
  }
}

// Enhanced fallback handling
async function handleModelFallback(req, res, originalError) {
  try {
    console.log("Attempting fallback to simpler model configuration");
    
    const { message, chatHistory = [] } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Simplify the request for fallback scenario
    const simplifiedConfig = {
      temperature: 0.2,
      maxOutputTokens: 512,
      topK: 20,
      topP: 0.8
    };
    
    // Create a simplified prompt
    const fallbackPrompt = 
`You are a helpful assistant for TradEX, a service provider platform.
Keep responses brief, friendly and focused on helping users.

User message: ${message}`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fallbackPrompt }] }],
      generationConfig: simplifiedConfig,
      safetySettings: safetySettings, // Moved safetySettings to the root level
    });
    
    return res.json({ 
      reply: result.response.text(),
      modelUsed: "gemini-pro-fallback",
      isFallback: true
    });
  } catch (fallbackError) {
    console.error("Fallback also failed:", fallbackError);
    return res.status(500).json({
      error: "Our AI assistant is currently unavailable. Please try again later or contact customer support.",
      errorCode: "COMPLETE_FAILURE"
    });
  }
}

// Helper function to enhance responses with TradEX-specific logic
function addResponseEnhancements(text, serviceContext) {
  // This is where you could add custom business logic
  // Like adding CTAs, tracking codes, or special formatting
  
  let enhanced = text;
  
  // Example enhancements:
  if (serviceContext) {
    enhanced += `\n\nWould you like to learn more about ${serviceContext.name} or see related services on TradEX?`;
  } else {
    enhanced += `\n\nExplore more services on TradEX or contact our support team for personalized recommendations.`;
  }
  
  return enhanced;
}

// Analytics logging function
function logInteraction(query, response, serviceName = null) {
  // Here you would add your analytics tracking
  console.log("Chat interaction:", {
    timestamp: new Date().toISOString(),
    queryLength: query.length,
    responseLength: response.length,
    service: serviceName,
    // You could send this to a database or analytics service
  });
}

module.exports = router;