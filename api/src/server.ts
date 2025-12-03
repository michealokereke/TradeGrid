import app from "./app/config/app.js";
import { ENV } from "./app/config/env.js";

app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔒 Security headers enabled via Helmet`);
  console.log(`📊 Request logging enabled via Morgan`);
});
