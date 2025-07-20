# Todo App Backend

A RESTful API for a todo application built with Node.js, Express, MongoDB, and Mizzle ORM.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Toggle todo completion status
- ✅ Filter todos by completion status and priority
- ✅ Input validation with Zod
- ✅ MongoDB integration with Mizzle ORM
- ✅ RESTful API design
- ✅ Error handling and validation

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Make sure MongoDB is running locally or update the MONGODB_URI in .env

5. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Get All Todos
```
GET /api/todos
Query Parameters:
- completed: boolean (optional)
- priority: low|medium|high (optional)
```

### Get Todo by ID
```
GET /api/todos/:id
```

### Create Todo
```
POST /api/todos
Body:
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "low|medium|high (optional, default: medium)",
  "dueDate": "ISO date string (optional)"
}
```

### Update Todo
```
PUT /api/todos/:id
Body: (all fields optional)
{
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "priority": "low|medium|high",
  "dueDate": "ISO date string"
}
```

### Toggle Todo Completion
```
PATCH /api/todos/:id/toggle
```

### Delete Todo
```
DELETE /api/todos/:id
```

## Example Usage

### Create a new todo:
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Mizzle ORM",
    "description": "Complete the todo app tutorial",
    "priority": "high"
  }'
```

### Get all todos:
```bash
curl http://localhost:3000/api/todos
```

### Filter completed todos:
````bash
curl http://localhost:3000/api/todos?completed=