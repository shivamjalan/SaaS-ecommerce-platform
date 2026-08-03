import { getStoreAnalytics } from "../services/analyticsService.js";
import Store from "../models/storeModel.js";
import Product from "../models/Product.js";

/* ===================================================== */
/* ================== OPENAI HELPER ==================== */
/* ===================================================== */

const getOpenAIUrl = () =>

  process.env.OPENAI_BASE_URL ||
  "https://api.openai.com/v1/chat/completions";

const callOpenAI = async (
  messages,
  maxTokens = 200
) => {

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (!apiKey) {

    const error = new Error(
      "AI is not configured. Add OPENAI_API_KEY to backend/.env"
    );

    error.status = 500;

    throw error;

  }

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    45000
  );

  try {

    const response = await fetch(
      getOpenAIUrl(),
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model:
            process.env.OPENAI_MODEL ||
            "gpt-4o-mini",
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),

        signal: controller.signal,
      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      const error = new Error(
        data.error?.message ||
          "OpenAI request failed"
      );

      error.status = 502;

      throw error;

    }

    return (
      data.choices?.[0]?.message
        ?.content?.trim() || ""
    );

  } catch (error) {

    if (error.name === "AbortError") {

      const timeoutError =
        new Error(
          "AI request timed out"
        );

      timeoutError.status = 504;

      throw timeoutError;

    }

    throw error;

  } finally {

    clearTimeout(timeout);

  }

};

/* ===================================================== */
/* =========== AI PRODUCT DESCRIPTION ================== */
/* ===================================================== */

export const generateProductDescription =
  async (req, res) => {

    try {

      const { name, category } =
        req.body;

      if (!name) {

        return res.status(400).json({
          error: "Product name is required",
        });

      }

      const description =
        await callOpenAI(
          [
            {
              role: "system",
              content:
                "You write short, persuasive product descriptions for a saree marketplace. Return 2-3 sentences. No markdown, no bullet points.",
            },
            {
              role: "user",
              content: `Write a product description for "${name}"${category ? ` in the ${category} category` : ""}.`,
            },
          ],
          150
        );

      res.json({ description });

    } catch (error) {

      console.error(error);

      res.status(error.status || 500).json({
        error: error.message,
      });

    }

  };

/* ===================================================== */
/* ============== AI SALES INSIGHTS ==================== */
/* ===================================================== */

export const generateSalesInsights =
  async (req, res) => {

    try {

      const analytics =
        await getStoreAnalytics(
          req.store._id
        );

      const dataSummary = {
        totalRevenue:
          analytics.totalRevenue,
        recentDailySales:
          analytics.dailySales.slice(-7),
        topProducts:
          analytics.topProducts,
        orderStatus:
          analytics.orderStatusBreakdown,
      };

      const insight =
        await callOpenAI(
          [
            {
              role: "system",
              content:
                "You are a business analyst for a saree marketplace merchant. Write 3-4 sentences summarizing store performance. Use rupee amounts. Be concise and encouraging. No markdown, no bullet points.",
            },
            {
              role: "user",
              content:
                JSON.stringify(dataSummary),
            },
          ],
          200
        );

      res.json({ insight });

    } catch (error) {

      console.error(error);

      res.status(error.status || 500).json({
        error: error.message,
      });

    }

  };

/* ===================================================== */
/* =============== CUSTOMER SUPPORT CHAT ================ */
/* ===================================================== */

export const chatReply =
  async (req, res) => {

    try {

      const {
        storeSlug,
        message,
        history,
      } = req.body;

      if (!storeSlug || !message) {

        return res.status(400).json({
          error: "Store slug and message are required",
        });

      }

      const store =
        await Store.findOne({
          slug: storeSlug,
        })
          .select("name")
          .lean();

      if (!store) {

        return res.status(404).json({
          error: "Store not found",
        });

      }

      const products =
        await Product.find({
          store: store._id,
        })
          .select(
            "name price category description stock image"
          )
          .limit(20)
          .lean();

      const catalog =
        products
          .map(
            (p) =>
              `- ${p.name} (₹${p.price}, ${p.category}, ${p.stock} in stock): ${p.description}`
          )
          .join("\n");

      const systemPrompt =
        [
          `You are the product assistant for "${store.name}", a saree marketplace store.`,
          "Answer shoppers' questions about the store's products only.",
          "",
          "You MAY help with:",
          "- product details (name, price, category, description, stock)",
          "- recommendations and comparisons between products in the catalog",
          "",
          "You MUST NOT do anything outside that. You must NEVER:",
          "- place, confirm, or accept orders or generate order IDs",
          "- process payments, refunds, or returns",
          "- track, cancel, or update orders",
          "- handle delivery, shipping, or support issues",
          "If a customer asks about ordering, paying, delivery, or support,",
          "say you can't do it and tell them to place the order on the website",
          "or contact the store owner. Never claim an order was placed or that any action was completed.",
          "",
          "Use ONLY the catalog below. If something is not listed, say it is not available.",
          "If the customer asks to list products or asks what you sell,",
          "list EVERY product from the catalog with name, price, and stock.",
          "Be friendly and concise, but when listing products always include all of them.",
          "",
          "Format: plain text. Do NOT use markdown — no **, *, #, or backticks.",
          "If the catalog has no products, say the store has no products yet.",
          "",
          `CATALOG:\n${catalog || "No products listed yet."}`,
        ].join("\n");

      const orderIntent =
        /\b(place(?: an?)? order|buy (?:now|this|one|it)|purchase|checkout|pay(?: for)?|payment|refund|return(?: policy|s)?|(?:track|cancel) order|order status|how do i order|can i order|deliver(?:y)?|shipping)\b/i;

      if (orderIntent.test(message)) {

        return res.json({
          reply:
            "I'm just a product assistant, so I can't place orders, process payments, or handle delivery, returns, or support. Please place your order through the website checkout — if you run into any trouble, the store owner can help you.",
        });

      }

      const messages = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...(Array.isArray(history)
          ? history.slice(-6).map((h) => ({
              role:
                h.role === "assistant"
                  ? "assistant"
                  : "user",
              content: String(
                h.content || ""
              ).slice(0, 1000),
            }))
          : []),
        {
          role: "user",
          content: message,
        },
      ];

      const reply =
        await callOpenAI(
          messages,
          500
        );

      res.json({ reply });

    } catch (error) {

      console.error(error);

      res.status(error.status || 500).json({
        error: error.message,
      });

    }

  };
