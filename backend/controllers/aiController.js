import { getStoreAnalytics } from "../services/analyticsService.js";

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
    15000
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
