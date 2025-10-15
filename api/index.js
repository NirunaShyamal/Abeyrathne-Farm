// Vercel serverless function entrypoint wrapping existing Express app (no extra adapter)
const { createApp, connectToDatabase } = require('../farm-backend/src/serverlessApp');

let appPromise;

module.exports = async function (req, res) {
  try {
    if (!appPromise) {
      appPromise = (async () => {
        await connectToDatabase();
        return createApp();
      })();
    }
    const app = await appPromise;
    return app(req, res);
  } catch (err) {
    console.error('Serverless handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
