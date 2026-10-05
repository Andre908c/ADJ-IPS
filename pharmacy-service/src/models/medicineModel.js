class Medicine {
  constructor({ id, name, description, stock, unit_price, category, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.stock = stock;
    this.unit_price = unit_price;
    this.category = category;
    this.created_at = created_at;
  }
}

module.exports = Medicine;