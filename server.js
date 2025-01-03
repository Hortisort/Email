import express from "express";
import bodyParser from "body-parser";  // To handle raw body correctly

const app = express();

// Array to store the incoming webhook data
let webhookData = [];

// Use raw body parser for JSON and urlencoded for form data
app.use(bodyParser.urlencoded({ extended: true }));  // Parses application/x-www-form-urlencoded
app.use(bodyParser.raw({ type: 'application/json' }));  // Use raw body parser for JSON

// Default PORT fallback
const PORT = 3000; // You can directly set it here or configure it manually

// Webhook POST route
app.post("/webhook", async (req, res) => {
  try {
    // Log the raw body received
    const rawBody = req.body;  // The raw body for form-urlencoded is parsed here
    console.log(`[${new Date().toISOString()}] Raw Incoming Body:`, rawBody);
    webhookData.push(rawBody);
    // If content-type is application/json (raw JSON)
    if (req.is("application/json")) {
      let parsedBody = null;
      try {
        parsedBody = JSON.parse(rawBody.toString());
        
        // Pretty print the parsed JSON
        console.log(`[${new Date().toISOString()}] Parsed Webhook Message:`, JSON.stringify(parsedBody, null, 2)); // 2 spaces indentation

        // Store the parsed data in the webhookData array
        
      } catch (e) {
        console.error(`[${new Date().toISOString()}] Error parsing JSON:`, e);
        return res.status(400).send("Invalid JSON format");
      }
    }

    // Example: Sending back the same data in the response
    res.status(200).send({
      status: "Received",
      receivedData: rawBody.toString()
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing the webhook:`, error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to retrieve the stored webhook data
app.get("/get-webhook-data", (req, res) => {
  res.json(webhookData);  // Send the stored webhook data as a JSON response
});

// Basic route for testing server status
app.get("/", (req, res) => {
  res.send("<pre>ZeptoMail Webhook Server</pre>");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
