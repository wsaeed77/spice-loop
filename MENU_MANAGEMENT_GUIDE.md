# Menu Management Guide

Complete guide on how to create, update, and manage menu items and deals in SpiceLoop.

## Accessing Menu Management

1. **Login as Admin:**
   - Go to: `https://spiceloop.com/login`
   - Email: `admin@spiceloop.com`
   - Password: `password` (change in production!)

2. **Navigate to Menu Management:**
   - From Admin Dashboard, click **"Manage Menu"** card
   - Or go directly to: `https://spiceloop.com/admin/menu`

---

## Creating a New Menu Item

### Step 1: Click "Add New Item"
- On the Menu Management page, click the **"+ Add New Item"** button (top right)

### Step 2: Fill in the Form

**Required Fields:**
- **Item Name** - The name of the menu item (e.g., "Butter Chicken")
- **Price** - The price in dollars (e.g., 16.99)

**Optional Fields:**
- **Description** - Detailed description of the item
- **Category** - Select from dropdown:
  - Curries
  - Rice Dishes
  - Breads
  - Appetizers
  - Desserts
  - Beverages
  - Vegetarian
  - Non-Vegetarian
- **Image URL** - Link to an image (e.g., `https://example.com/image.jpg`)

**Checkboxes:**
- ✅ **Available for ordering** - Check if item should be visible to customers
- ✅ **Include in subscription menu** - Check if item can be part of weekly subscription

### Step 3: Save
- Click **"Create Menu Item"** button
- You'll be redirected back to the menu list with a success message

---

## Editing a Menu Item

### Step 1: Find the Item
- On the Menu Management page, find the item you want to edit
- Click the **"Edit"** link in the Actions column

### Step 2: Update Fields
- Modify any fields you want to change
- All fields work the same as when creating

### Step 3: Save Changes
- Click **"Update Menu Item"** button
- Changes are saved immediately

---

## Deleting a Menu Item

1. On the Menu Management page, find the item
2. Click **"Delete"** link in the Actions column
3. Confirm the deletion in the popup
4. The item will be permanently removed

⚠️ **Warning:** Deletion cannot be undone!

---

## Menu Item Fields Explained

### Item Name
- The display name shown to customers
- Example: "Butter Chicken", "Biryani", "Naan"

### Description
- Detailed information about the item
- Helps customers understand what they're ordering
- Example: "Creamy tomato-based curry with tender chicken pieces, cooked in butter and aromatic spices."

### Price
- The cost in USD
- Use decimal format (e.g., 16.99, 12.50)
- Minimum: $0.00

### Category
- Groups similar items together
- Helps organize the menu
- Customers can filter by category (if implemented)

### Image URL
- Link to an image hosted online
- Should be a direct link to the image file
- Formats: `.jpg`, `.png`, `.webp`
- Example: `https://yourdomain.com/images/butter-chicken.jpg`

### Available for Ordering
- **Checked:** Item appears on the public menu
- **Unchecked:** Item is hidden from customers (but still exists in database)
- Useful for temporarily disabling items

### Include in Subscription Menu
- **Checked:** Item can be selected for weekly subscription menu
- **Unchecked:** Item is only available for regular orders
- Only subscription items appear in the Weekly Menu management

---

## Managing Weekly Menu (Subscription Items)

### Setting Up Weekly Menu

1. **First, create menu items** with "Include in subscription menu" checked
2. Go to **"Weekly Menu"** from Admin Dashboard
3. Select items for each day (Monday-Friday)
4. Items selected here will appear in the subscription menu

### Weekly Menu vs Regular Menu

- **Regular Menu Items:** Available for one-time orders
- **Subscription Menu Items:** Available for weekly subscription customers
- An item can be both (check both boxes)

---

## Tips & Best Practices

### 1. **Use Clear, Descriptive Names**
- ✅ Good: "Butter Chicken Curry"
- ❌ Bad: "BC1" or "Item #5"

### 2. **Write Compelling Descriptions**
- Include key ingredients
- Mention cooking style or origin
- Highlight special features

### 3. **Set Appropriate Prices**
- Research competitor pricing
- Consider ingredient costs
- Factor in preparation time

### 4. **Use High-Quality Images**
- Images should be clear and appetizing
- Recommended size: 800x600px or larger
- Use consistent aspect ratios

### 5. **Organize with Categories**
- Group similar items together
- Makes menu easier to navigate
- Helps with inventory management

### 6. **Manage Availability**
- Uncheck "Available" to temporarily hide items
- Useful when items are out of stock
- Better than deleting and recreating

---

## Common Use Cases

### Adding a New Dish
1. Create menu item with all details
2. Set price and category
3. Add image URL
4. Check "Available for ordering"
5. If it's a subscription item, check that too

### Temporarily Out of Stock
1. Edit the menu item
2. Uncheck "Available for ordering"
3. Item disappears from public menu
4. Re-check when back in stock

### Creating a Deal/Promotion
Currently, deals are managed through regular menu items. You can:
- Create a menu item with a special name (e.g., "Weekend Special: Biryani Combo")
- Set a discounted price
- Use description to explain the deal
- Add to a "Deals" or "Specials" category

### Setting Up Subscription Menu
1. Create items with "Include in subscription menu" checked
2. Go to Weekly Menu management
3. Assign items to specific days
4. Customers will see these in their subscription dashboard

---

## Troubleshooting

### Item Not Showing on Public Menu
- ✅ Check "Available for ordering" is checked
- ✅ Verify price is set correctly
- ✅ Clear browser cache
- ✅ Check if item was deleted

### Can't Add to Subscription Menu
- ✅ Check "Include in subscription menu" is checked
- ✅ Item must exist first before adding to weekly menu

### Image Not Displaying
- ✅ Verify image URL is correct and accessible
- ✅ Check URL starts with `http://` or `https://`
- ✅ Test URL in browser directly
- ✅ Use a reliable image hosting service

### Price Format Issues
- ✅ Use decimal format: `16.99` not `$16.99`
- ✅ Minimum is `0.00`
- ✅ No currency symbols in price field

---

## Quick Reference

| Action | URL | Method |
|--------|-----|--------|
| View All Items | `/admin/menu` | GET |
| Create New Item | `/admin/menu/create` | GET |
| Save New Item | `/admin/menu` | POST |
| Edit Item | `/admin/menu/{id}/edit` | GET |
| Update Item | `/admin/menu/{id}` | PUT |
| Delete Item | `/admin/menu/{id}` | DELETE |

---

## Need Help?

If you encounter issues:
1. Check that you're logged in as admin
2. Verify all required fields are filled
3. Clear browser cache
4. Check server logs: `storage/logs/laravel.log`

---

## Future Enhancements

Potential features that could be added:
- Bulk import/export menu items
- Image upload (instead of URL)
- Menu item variants (sizes, spice levels)
- Nutritional information
- Allergen warnings
- Discount codes/promotions system
- Menu item scheduling (available on specific dates)

