import crypto from 'crypto';

// In-memory user store (replace with actual database)
class UserStore {
  constructor() {
    this.users = new Map();
    this.emailIndex = new Map(); // Optimized email lookup
  }

  async create(data) {
    // Check if email already exists
    if (this.emailIndex.has(data.email)) {
      return null;
    }

    const user = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(user.id, user);
    this.emailIndex.set(user.email, user.id);
    return user;
  }

  async findById(id) {
    return this.users.get(id) || null;
  }

  async findByEmail(email) {
    const id = this.emailIndex.get(email);
    return id ? this.users.get(id) || null : null;
  }

  async update(id, data) {
    const user = this.users.get(id);
    if (!user) return null;

    // Update email index if email changed
    if (data.email && data.email !== user.email) {
      if (this.emailIndex.has(data.email)) {
        return null; // Email already exists
      }
      this.emailIndex.delete(user.email);
      this.emailIndex.set(data.email, id);
    }

    const updated = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id) {
    const user = this.users.get(id);
    if (user) {
      this.emailIndex.delete(user.email);
      return this.users.delete(id);
    }
    return false;
  }

  async findAll() {
    return Array.from(this.users.values());
  }
}

export const userStore = new UserStore();
