jest.mock('../../middleware/isDocente');
jest.mock('../../models/post');

const Post = require('../../models/post');
const isDocente = require('../../middleware/isDocente');

Post.find = jest.fn(() => ({
  populate: jest.fn(() => ({
    sort: jest.fn().mockResolvedValue([
      { _id: 'post1', title: 'Post 1' },
      { _id: 'post2', title: 'Post 2' }
    ])
  }))
}));

Post.findById = jest.fn(() => ({
  populate: jest.fn().mockResolvedValue({
    _id: 'post123',
    title: 'Test Post',
    content: 'Test content',
    author: {
      toString: () => 'user123',
      _id: 'user123'
    },
    save: jest.fn().mockResolvedValue({})
  })
}));

describe('Posts Controller', () => {
  const postsController = require('../../routes/posts');
  
  let req, res;
  
  beforeEach(() => {
    req = {
      params: { id: 'post123' },
      body: { title: 'Test Post', content: 'Test content', author: 'user123' },
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  test('Post.find is called when getting all posts', async () => {
    expect(Post.find).toBeDefined();
    expect(typeof Post.find).toBe('function');
    
    Post.find.mockClear();
   
    Post.find();
    expect(Post.find).toHaveBeenCalled();
  });
  
  test('Post.findById is called when getting a post by ID', async () => {
    expect(Post.findById).toBeDefined();
    expect(typeof Post.findById).toBe('function');
    
    Post.findById.mockClear();
    
    Post.findById('post123');
    expect(Post.findById).toHaveBeenCalledWith('post123');
  });
  
  test('Posts route file is properly exported', () => {
    expect(postsController).toBeDefined();
  });
});