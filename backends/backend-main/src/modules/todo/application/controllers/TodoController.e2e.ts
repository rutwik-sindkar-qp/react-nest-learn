import { TodoDto } from '@src/modules/todo/application/dtos/TodoDto';
import { ITestApp, testSetupUtil } from '@test/TestSetupUtil';
import * as request from 'supertest';

describe('TodoController E2E Tests', () => {
  let testApp: ITestApp;

  beforeEach(async () => {
    testApp = await testSetupUtil.startTestApp();
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

 
  it('should return 400 when title exceeds max length', async () => {
    const longTitle = 'a'.repeat(300);

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
      .delete('/todos/999999');
    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body.message).toBe(`Todo with ID 999999 not found`);
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
      .put('/todos/abc') // invalid ID
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


describe('GET /todos', () => {
  it('should return all todos', async () => {
  
    const todo1: TodoDto = { title: 'Todo 1' };
    const todo2: TodoDto = { title: 'Todo 2' };

    await request(testApp.app.getHttpServer()).post('/todos').send(todo1);
    await request(testApp.app.getHttpServer()).post('/todos').send(todo2);

    
    const response = await request(testApp.app.getHttpServer()).get('/todos');

   
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2); 
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0].title).toBeDefined();
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
