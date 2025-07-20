const { z } = require('zod');
const { ObjectId } = require('mongodb');

// Zod schema for validation
const TodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

const CreateTodoSchema = TodoSchema.omit({ createdAt: true, updatedAt: true });
const UpdateTodoSchema = TodoSchema.partial().omit({ createdAt: true });

class TodoModel {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('todos');
  }

  async create(todoData) {
    try {
      const validatedData = CreateTodoSchema.parse({
        ...todoData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const result = await this.collection.insertOne(validatedData);
      return { _id: result.insertedId, ...validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  async findAll(filters = {}) {
    const query = {};
    
    if (filters.completed !== undefined) {
      query.completed = filters.completed;
    }
    
    if (filters.priority) {
      query.priority = filters.priority;
    }

    const todos = await this.collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return todos;
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid todo ID');
    }
    
    const todo = await this.collection
      .findOne({ _id: new ObjectId(id) });
    
    return todo;
  }

  async update(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid todo ID');
    }

    try {
      const validatedData = UpdateTodoSchema.parse({
        ...updateData,
        updatedAt: new Date()
      });

      const result = await this.collection
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: validatedData },
          { returnDocument: 'after' }
        );

      return result.value;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid todo ID');
    }

    const result = await this.collection
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  }

  async toggleComplete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid todo ID');
    }

    const todo = await this.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    return this.update(id, { completed: !todo.completed });
  }

  async getStats() {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          }
        }
      }
    ];

    const result = await this.collection.aggregate(pipeline).toArray();
    return result[0] || { total: 0, completed: 0, pending: 0, highPriority: 0 };
  }
}

module.exports = {
  TodoModel,
  TodoSchema,
  CreateTodoSchema,
  UpdateTodoSchema
};