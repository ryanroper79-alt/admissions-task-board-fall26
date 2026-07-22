import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { _resetForTests } from '../src/store.js';

describe('task API', () => {
  let server;
  let port;

  before(async () => {
    const { app } = await import('../src/server.js');
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    port = server.address().port;
  });

  beforeEach(() => _resetForTests());

  after(async () => {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  });

  it('marks a task complete via PATCH', async () => {
    await fetch(`http://127.0.0.1:${port}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' }),
    });
    const res = await fetch(`http://127.0.0.1:${port}/api/tasks/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    assert.equal(res.status, 200, 'fix PATCH handler to read req.params.id');
    const body = await res.json();
    assert.equal(body.task.title, 'Test');
    assert.equal(body.task.completed, true);
  });

  it('deletes a task via DELETE', async () => {
    await fetch(`http://127.0.0.1:${port}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Delete me' }),
    });

    const deleteRes = await fetch(`http://127.0.0.1:${port}/api/tasks/1`, {
      method: 'DELETE',
    });
    assert.equal(deleteRes.status, 200);
    const deleteBody = await deleteRes.json();
    assert.equal(deleteBody.task.title, 'Delete me');

    const listRes = await fetch(`http://127.0.0.1:${port}/api/tasks`);
    const listBody = await listRes.json();
    assert.deepEqual(listBody.tasks, []);
  });

  it('returns 404 when deleting an unknown task', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/api/tasks/999`, {
      method: 'DELETE',
    });
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not found' });
  });
});
