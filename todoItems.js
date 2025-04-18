// const router = require('express').Router();
// //import todo model 
// const todoItemsModel = require('../models/todoItems');


// //create first route --add Todo Item to database
// router.post('/api/item', async (req, res)=>{
//   try{
//     const newItem = new todoItemsModel({
//       item: req.body.item
//     })
//     //save this item in database
//     const saveItem = await newItem.save()
//     res.status(200).json(saveItem);
//   }catch(err){
//     res.json(err);
//   }
// })

// //create second route -- get data from database
// router.get('/api/items', async (req, res)=>{
//   try{
//     const allTodoItems = await todoItemsModel.find({});
//     res.status(200).json(allTodoItems)
//   }catch(err){
//     res.json(err);
//   }
// })


// //update item
// router.put('/api/item/:id', async (req, res)=>{
//   try{
//     //find the item by its id and update it
//     const updateItem = await todoItemsModel.findByIdAndUpdate(req.params.id, {$set: req.body});
//     res.status(200).json(updateItem);
//   }catch(err){
//     res.json(err);
//   }
// })


// //Delete item from database
// router.delete('/api/item/:id', async (req, res)=>{
//   try{
//     //find the item by its id and delete it
//     const deleteItem = await todoItemsModel.findByIdAndDelete(req.params.id);
//     res.status(200).json('Item Deleted');
//   }catch(err){
//     res.json(err);
//   }
// })


// //export router
// module.exports = router;




const router = require('express').Router();
const todoItemsModel = require('../models/todoItems');

// Create a new task
router.post('/api/item', async (req, res) => {
  try {
    const { title, description, dueDate, category, completed } = req.body;

    const newItem = new todoItemsModel({
      title,
      description,
      dueDate,
      category,
      completed: completed || false
    });

    const savedItem = await newItem.save();
    res.status(200).json(savedItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all tasks
router.get('/api/items', async (req, res) => {
  try {
    const allTodoItems = await todoItemsModel.find({});
    res.status(200).json(allTodoItems);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update task by ID
router.put('/api/item/:id', async (req, res) => {
  try {
    const updateItem = await todoItemsModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete task by ID
router.delete('/api/item/:id', async (req, res) => {
  try {
    await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Item Deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
