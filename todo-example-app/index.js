const app = require('./src/app');
const { connectDB } = require('./src/config/database');

async function startServer() {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Todo API server running on port ${PORT}`);
      console.log(`📝 API Documentation available at http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();