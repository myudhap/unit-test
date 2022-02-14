const uuid = require('uuid')
const supertest = require('supertest')
const env = require('./config')

let host = env.host
const lastChar = host.slice(-1);
lastChar === '/' ? "" : host += '/';
const req = supertest(host)

const randomId = uuid.v4();

let email = `${randomId}@test.com`
let title = "testing112"
let titleUpdate = "testing112Updated"
let activityId = 1;
let todoTitle = "todoTesting"
let todoTitleUpdate = "todoTestingUpdated"
let todoId = 1;

describe('Create Activity', () => {
  test("Positive case: Berhasil menambahkan data activity baru /* 5 */.", async () => {
    const res = await req.post('activity-groups').send({
      title,
      email
    })

    if (res.body && res.body.data) activityId = res.body.data.id;

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data.title).toEqual(title);
    expect(res.body.data.email).toEqual(email);
  })

  test("Negative case: Menampilkan response status 400, gagal menambahkan activity baru jika title tidak diisi /* 10 */.", async () => {
    const res = await req.post('activity-groups').send({
      email
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toEqual("Bad Request");
    expect(res.body.message).toEqual("title cannot be null");
  })
})

describe('Update Activity', () => {
  test("Positive case: Berhasil melakukan update data activity /* 5 */.", async () => {
    const res = await req.patch('activity-groups/' + activityId).send({
      title: titleUpdate
    })
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data.id).toEqual(activityId);
    expect(res.body.data.title).toEqual(titleUpdate);
    expect(res.body.data.email).toEqual(email);
  })

  test("Negative case: Menampilkan response status 404, gagal melakukan update activity data jika data dengan id pada parameter tidak ditemukan /* 10 */.", async () => {
    const res = await req.patch('activity-groups/999999999').send({
      title
    })
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual("Not Found");
    expect(res.body.message).toEqual("Activity with ID 999999999 Not Found");
  })
})

describe('Get Detail activity', () => {
  test("Positive case: Berhasil menampilkan response get detail activity /* 5 */.", async () => {
    const res = await req.get('activity-groups/' + activityId);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data.id).toEqual(activityId);
    expect(res.body.data.title).toEqual(titleUpdate);
    expect(res.body.data.email).toEqual(email);
  })

  test("Negative case: Menampilkan response status 404, gagal get detail data dengan id pada parameter yang tidak ditemukan /* 10 */.", async () => {
    const res = await req.get('activity-groups/999999999');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual("Not Found");
    expect(res.body.message).toEqual(`Activity with ID 999999999 Not Found`);
  })
})

describe('Get List activity', () => {
  test("Positive case: Berhasil menampilkan response get list activity /* 5 */.", async () => {
    const res = await req.get('activity-groups');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(Array.isArray([res.body.data])).toBe(true);
  })
})

describe('Create todo', () => {
  test("Positive case: Berhasil menambahkan data todo baru /* 5 */.", async () => {
    const res = await req.post('todo-items').send({
      activity_group_id: activityId,
      title: todoTitle
    });
    
    if (res.body && res.body.data) todoId = res.body.data.id;

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data.title).toEqual(todoTitle);
    expect(res.body.data.activity_group_id).toEqual(activityId);
    expect(res.body.data.is_active).toEqual(true);
    expect(res.body.data.priority).toEqual("very-high");
  })

  test("Negative case: Menampilkan response status 400, gagal menambahkan todo baru jika title tidak diisi /* 10 */.", async () => {
    const res = await req.post('todo-items').send({
      activity_group_id: activityId
    });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toEqual("Bad Request");
    expect(res.body.message).toEqual("title cannot be null");
  })

  test("Negative case: Menampilkan response status 400, gagal menambahkan todo baru jika activity_group_id tidak diisi /* 10 */.", async () => {
    const res = await req.post('todo-items').send({
      title: todoTitle
    });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toEqual("Bad Request");
    expect(res.body.message).toEqual("activity_group_id cannot be null");
  })
})

describe('Update todo', () => {
  test("Positive case: Berhasil melakukan update data title todo /* 5 */.", async () => {
    const res = await req.patch('todo-items/' + todoId).send({
      title: todoTitleUpdate
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data.title).toEqual(todoTitleUpdate);
    expect(res.body.data.priority).toEqual("very-high");
  })

  test("Positive case: Berhasil melakukan update data status todo /* 5 */.", async () => {
    const res = await req.patch('todo-items/' + todoId).send({
      is_active: false
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data.title).toEqual(todoTitleUpdate);
    expect(res.body.data.priority).toEqual("very-high");
  })

  test("Negative case: Menampilkan response status 404, gagal melakukan update todo jika data dengan id pada parameter tidak ditemukan /* 10 */.", async () => {
    const res = await req.patch('todo-items/999999999').send({
      title: todoTitleUpdate,
      is_active: false
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual("Not Found");
    expect(res.body.message).toEqual("Todo with ID 999999999 Not Found");
  })
})

describe('Get Detail todo', () => {
  test("Positive case: Berhasil menampilkan response get detail todo /* 5 */.", async () => {
    const res = await req.get('todo-items/' + todoId);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data.title).toEqual(todoTitleUpdate);
    expect(res.body.data.priority).toEqual("very-high");
  })

  test("Negative case: Menampilkan response status 404, gagal get detail todo jika data dengan id pada parameter tidak ditemukan /* 10 */.", async () => {
    const res = await req.get('todo-items/999999999');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual("Not Found");
    expect(res.body.message).toEqual("Todo with ID 999999999 Not Found");
  })
})

describe('Get List todo', () => {
  test("Positive case: Berhasil menampilkan response get list todo /* 5 */.", async () => {
    const res = await req.get('todo-items?activity_group_id=' + activityId);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(Array.isArray([res.body.data])).toBe(true);
  })

  test("Negative case: Menampilkan data kosong ketika data dengan id pada parameter tidak ditemukan /* 10 */.", async () => {
    const res = await req.get('todo-items?activity_group_id=999999999');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(Array.isArray([res.body.data])).toBe(true);
    expect(res.body.data).toEqual([]);
  })
})

describe('Delete todo', () => {
  test("Positive case: Berhasil mengehapus data todo /* 5 */.", async () => {
    const res = await req.delete('todo-items/' + todoId);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data).toEqual({});
  })

  test("Negative case: Menampilkan response status 404, gagal hapus data todo jika data dengan id pada parameter tidak ditemukan /* 10 */.", async () => {
    const res = await req.delete('todo-items/999999999');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual("Not Found");
    expect(res.body.message).toEqual("Todo with ID 999999999 Not Found");
  })
})

describe('Delete activity', () => {
  test("Positive case: Berhasil mengehapus data activity /* 5 */.", async () => {
    const res = await req.delete('activity-groups/' + activityId);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("Success");
    expect(res.body.data).toEqual({});
  })

  test("Negative case: Menampilkan response status 404, gagal hapus data todo jika data dengan id pada parameter tidak ditemukan /* 10 */.", async () => {
    const res = await req.delete('activity-groups/999999999');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual("Not Found");
    expect(res.body.message).toEqual("Activity with ID 999999999 Not Found");
  })
})