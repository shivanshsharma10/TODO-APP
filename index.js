const { isUtf8 } = require('buffer')
const express = require('express')
const fs = require('fs')
const app = express()
const file_path = 'todo.json'
function fileData(){
  try{
    let data = fs.readFileSync(file_path,'Utf8')
  return JSON.parse(data)
  }
  catch{
    console.error("error occured while reading the file")
    return [];
  }
}
function writeData(data){
  fs.writeFileSync(file_path,JSON.stringify(data),'utf-8')
}
app.use(express.json());
app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('/todo', function (req, res) {
  res.send(fileData())
})
app.post('/add', function(req,res){
  const {task} = req.body;
  if(!task){
    return res.status(400).json({ error: "Task is required" });
  }

  const todo = fileData();
  todo.push({task,"done":false})
  writeData(todo)
  res.status(201).json({message:'task added successfully'})
})

app.delete('/delete/:task',(req,res)=>{
  const {task} = req.params;
 
  const todo = fileData();
  const index = todo.findIndex(todos => todos.task === task)
  if(index=== -1){
    res.status(401).json({message:`${task} dont exist`})
  }
  todo.splice(index,1)
  writeData(todo)
  res.status(201).json({message:`${task} deleted succesfully`})
})

app.put('/mark',(req,res)=>{
  const {task} = req.body;
  const todo = fileData();
  const index = todo.findIndex(todos => todos.task === task)
  if(index=== -1){
    res.status(401).json({message:`${task} dont exist`})
  }
  todo[index].done = true;
  writeData(todo)
  res.json({message:'task updated successfully'})
})

app.listen(3000 , console.log("server started"))
