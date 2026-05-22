const router = require("express").Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
  });
});

module.exports = router;