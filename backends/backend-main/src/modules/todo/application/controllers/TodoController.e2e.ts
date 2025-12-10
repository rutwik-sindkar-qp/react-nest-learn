import { TodoDto } from '@src/modules/todo/application/dtos/TodoDto';
import { ITestApp, testSetupUtil } from '@test/TestSetupUtil';
import * as request from 'supertest';
import { TodoRepository } from '@src/modules/todo/domain/repositories/TodoRepository';
import { TodoEntity } from '@modules/todo/domain/entities/TodoEntity';
describe('TodoController E2E Tests', () => {
  let testApp: ITestApp;
    let todoRepository: TodoRepository;

  beforeEach(async () => {
    testApp = await testSetupUtil.startTestApp();
       todoRepository = testApp.app.get<TodoRepository>(TodoRepository);
    await todoRepository.deleteAllTodos();
      });

  afterEach(async () => {
    await testSetupUtil.closeApp(testApp);
  });



  describe('POST /todos', () => {

  it('should create a new todo', async () => {
    const createTodo: TodoDto = { title: 'Test Todo' };

    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send(createTodo);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(createTodo.title);
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('title should not be empty');
  });

  it('should return 400 when title is empty', async () => {
    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send({ title: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('title should not be empty');
  });

  it('should return 400 when title is not a string', async () => {
    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send({ title: 123 });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('title must be a string');
  });

  it('should return 400 when title length is less than 1', async () => {
    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send({ title: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('title should not be empty');
  });

  it('should create todo when title length is 1', async () => {
    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send({ title: 'a' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('a');
    expect(response.body.id).toBeDefined();
  });

  it('should create todo when title length is 255', async () => {
    const longTitle = 'a'.repeat(255);

    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send({ title: longTitle });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(longTitle);
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 when title length exceeds 255', async () => {
    const longTitle = 'a'.repeat(256);

    const response = await request(testApp.app.getHttpServer())
      .post('/todos')
      .send({ title: longTitle });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('title must be shorter');
  });

});


  describe('DELETE /todos/:id', () => {
    it('should delete a todo by id', async () => {
      const todoToCreate: TodoDto = { title: 'Todo to delete' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);
      const todoId = createResponse.body.id;
      const deleteResponse = await request(testApp.app.getHttpServer())
        .delete(`/todos/${todoId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBeDefined();
      const getResponse = await request(testApp.app.getHttpServer())
        .get(`/todos/${todoId}`);
      expect(getResponse.status).toBe(404);
    });
    it('should return 404 if todo does not exist', async () => {
      const deleteResponse = await request(testApp.app.getHttpServer())
        .delete('/todos/1111111');
      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body.message).toBe(`Todo with ID 1111111 not found`);
    });
    it('should return 400 for invalid id format', async () => {
      const deleteResponse = await request(testApp.app.getHttpServer())
        .delete('/todos/invalid-id');
      expect(deleteResponse.status).toBe(400);
      expect(deleteResponse.body.message).toContain('Validation failed');
    });
    it('should return 404 if todo already deleted', async () => {
      const todoToCreate: TodoDto = { title: 'Todo to delete twice' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);
      const todoId = createResponse.body.id;

      await request(testApp.app.getHttpServer()).delete(`/todos/${todoId}`);

      const deleteAgainResponse = await request(testApp.app.getHttpServer())
        .delete(`/todos/${todoId}`);
      expect(deleteAgainResponse.status).toBe(404);
      expect(deleteAgainResponse.body.message).toBe(`Todo with ID ${todoId} not found`);
    });

  });


  describe('PUT /todos/:id', () => {
    it('should update a todo by id', async () => {

      const todoToCreate: TodoDto = { title: 'Original Todo' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);

      const todoId = createResponse.body.id;


      const updateTodo = { title: 'Updated Todo' };
      const updateResponse = await request(testApp.app.getHttpServer())
        .put(`/todos/${todoId}`)
        .send(updateTodo);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe(updateTodo.title);
      expect(updateResponse.body.id).toBe(todoId);


      const getResponse = await request(testApp.app.getHttpServer())
        .get(`/todos/${todoId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.title).toBe(updateTodo.title);
    });

    it('should return 404 for non-existent todo', async () => {
      const nonExistentId = 99999;
      const updateResponse = await request(testApp.app.getHttpServer())
        .put(`/todos/${nonExistentId}`)
        .send({ title: 'Should fail' });

      expect(updateResponse.status).toBe(404);
      expect(updateResponse.body.message).toBe('Todo not found');
    });

    it('should return 400 for invalid id format', async () => {
      const updateResponse = await request(testApp.app.getHttpServer())
        .put('/todos/xyz')
        .send({ title: 'Invalid ID' });

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.message).toBeDefined();
    });

    it('should allow partial update', async () => {
      const todoToCreate: TodoDto = { title: 'Partial Update Todo' };
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todoToCreate);

      const todoId = createResponse.body.id;


      const partialUpdate = { title: 'Partially Updated' };
      const updateResponse = await request(testApp.app.getHttpServer())
        .put(`/todos/${todoId}`)
        .send(partialUpdate);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe(partialUpdate.title);
    });
  });




describe('GET /todos Pagination Tests', () => {
  let testApp: ITestApp;

  beforeEach(async () => {
    testApp = await testSetupUtil.startTestApp();

    const repo = testApp.app.get(TodoRepository);
    await repo.deleteAllTodos();
  });

  afterEach(async () => {
    await testSetupUtil.closeApp(testApp);
  });

  
  async function createTodos(count: number) {
    const repo = testApp.app.get(TodoRepository);

    const todos = Array.from({ length: count }, (_, i) => {
      const t = new TodoEntity();
      t.title = `Todo ${i + 1}`;
      return t;
    });

    await repo.testingOnlyCreateTodos(todos);
  }


  it('should return empty array when no todos exist', async () => {
    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return first 10 todos for page=1', async () => {
    await createTodos(25);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
    expect(response.body[0].title).toBe('Todo 1');
    expect(response.body[9].title).toBe('Todo 10');
  });

  it('should return next 10 todos for page=2', async () => {
    await createTodos(25);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=2&limit=10');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
    expect(response.body[0].title).toBe('Todo 11');
    expect(response.body[9].title).toBe('Todo 20');
  });

  it('should return remaining 5 todos on page=3', async () => {
    await createTodos(25);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=3&limit=10');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
    expect(response.body[0].title).toBe('Todo 21');
    expect(response.body[4].title).toBe('Todo 25');
  });

  it('should return empty array for page greater than total pages', async () => {
    await createTodos(12);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=5&limit=10');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should default to page=1 when page is missing', async () => {
    await createTodos(12);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?limit=10');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
  });

  it('should default to limit=10 when limit is missing', async () => {
    await createTodos(25);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=2');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
    expect(response.body[0].title).toBe('Todo 11');
  });

  it('should handle invalid (non-numeric) page parameter', async () => {
    await createTodos(12);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=abc&limit=10');

    expect(response.status).toBe(200); // default page=1
    expect(response.body.length).toBe(10);
  });

  it('should handle invalid (non-numeric) limit parameter', async () => {
    await createTodos(25);

    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=2&limit=xyz');

    expect(response.status).toBe(200); // default limit=10
    expect(response.body.length).toBe(10);
  });

  it('should return 400 if page is negative', async () => {
    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=-1&limit=10');

    expect(response.status).toBe(400);
  });

  it('should return 400 if limit is negative', async () => {
    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=1&limit=-5');

    expect(response.status).toBe(400);
  });

  it('should return 400 if limit is zero', async () => {
    const response = await request(testApp.app.getHttpServer())
      .get('/todos?page=1&limit=0');

    expect(response.status).toBe(400);
  });
});




  describe('GET /todos/:id', () => {
    it('should return a todo by id', async () => {

      const todo: TodoDto = { title: 'Single Todo' };
      const createRes = await request(testApp.app.getHttpServer())
        .post('/todos')
        .send(todo);
      const todoId = createRes.body.id;


      const response = await request(testApp.app.getHttpServer())
        .get(`/todos/${todoId}`);


      expect(response.status).toBe(200);
      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe(todo.title);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(testApp.app.getHttpServer())
        .get('/todos/99999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Todo not found');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(testApp.app.getHttpServer())
        .get('/todos/abc');
      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

});
