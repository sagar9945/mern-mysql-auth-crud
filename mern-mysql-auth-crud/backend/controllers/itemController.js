const db = require('../config/db');

// @GET /api/items
const getItems = async (req, res, next) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, items });
  } catch (err) { next(err); }
};

// @GET /api/items/:id
const getItem = async (req, res, next) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, item: items[0] });
  } catch (err) { next(err); }
};

// @POST /api/items
const createItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const [result] = await db.query(
      'INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description || null, status || 'active']
    );
    const [newItem] = await db.query('SELECT * FROM items WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Item created', item: newItem[0] });
  } catch (err) { next(err); }
};

// @PUT /api/items/:id
const updateItem = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Check ownership
    const [existing] = await db.query(
      'SELECT id FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await db.query(
      'UPDATE items SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description || null, status, req.params.id, req.user.id]
    );

    const [updated] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Item updated', item: updated[0] });
  } catch (err) { next(err); }
};

// @DELETE /api/items/:id
const deleteItem = async (req, res, next) => {
  try {
    const [existing] = await db.query(
      'SELECT id FROM items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    await db.query('DELETE FROM items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) { next(err); }
};

// @GET /api/stats
const getStats = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        COUNT(*) AS total,
        SUM(status = 'active') AS active,
        SUM(status = 'pending') AS pending,
        SUM(status = 'completed') AS completed
      FROM items WHERE user_id = ?`,
      [req.user.id]
    );
    res.json({ success: true, stats: rows[0] });
  } catch (err) { next(err); }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, getStats };