// Temporary in-memory data
let closet = [
  { id: 1, name: "Blue T-shirt", category: "Top" },
  { id: 2, name: "Black Jeans", category: "Bottom" }
];

// Get all items
const getClosetItems = (req, res) => {
  res.json(closet);
};

// Add new item
const addClothingItem = (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: "Name and category are required" });
  }

  const newItem = { id: closet.length + 1, name, category };
  closet.push(newItem);

  res.status(201).json(newItem);
};

module.exports = { getClosetItems, addClothingItem };
