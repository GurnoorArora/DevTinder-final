const express=require('express');
const openai=require("../utils/openAiclient");

const router=express.Router();


router.get("/test-openai", async (req, res) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "Hello TeemUp, testing OpenAI connection!"
    });

    res.json({
      success: true,
      vectorLength: response.data[0].embedding.length, // should be 1536
    });
  } catch (error) {
    console.error("OpenAI test error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports=router;