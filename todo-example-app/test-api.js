const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Todo API...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check:', health.data.status);

    // Test creating a todo
    console.log('\n2. Creating a new todo...');
    const newTodo = await axios.post(`${BASE_URL}/todos`, {
      title: 'Test Todo',
      description: 'This is a test todo',
      priority: 'high'
    });
    console.log('✅ Created todo:', newTodo.data.data.title);
    const todoId = newTodo.data.data._id;

    // Test getting all todos
    console.log('\n3. Getting all todos...');
    const allTodos = await axios.get(`${BASE_URL}/todos`);
    console.log('✅ Found', allTodos.data.count, 'todos');

    // Test getting todo by ID
    console.log('\n4. Getting todo by ID...');
    const todoById = await axios.get(`${BASE_URL}/todos/${todoId}`);
    console.log('✅ Found todo:', todoById.data.data.title);

    // Test updating todo
    console.log('\n5. Updating todo...');
    const updatedTodo = await axios.put(`${BASE_URL}/todos/${todoId}`, {
      title: 'Updated Test Todo',
      completed: true
    });
    console.log('✅ Updated todo:', updatedTodo.data.data.title);

    // Test toggle completion
    console.log('\n6. Toggling completion...');
    const toggledTodo = await axios.patch(`${BASE_URL}/todos/${todoId}/toggle`);
    console.log('✅ Toggled completion:', toggledTodo.data.data.completed);

    // Test stats
    console.log('\n7. Getting stats...');
    const stats = await axios.get(`${BASE_URL}/todos/stats`);
    console.log('✅ Stats:', stats.data.data);

    // Test deleting todo
    console.log('\n8. Deleting todo...');
    await axios.delete(`${BASE_URL}/todos/${todoId}`);
    console.log('✅ Todo deleted successfully');

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;