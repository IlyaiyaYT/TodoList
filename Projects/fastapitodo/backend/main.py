from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    id: int
    title: str
    completed: bool = False

class CreateTodo(BaseModel):
    title: str
    completed: bool = False

todos: List[Todo] = []
nextid = 1

@app.post("/todos", response_model=Todo)
def create_todo(todo : CreateTodo):
    global nextid
    new_todo = Todo(id=nextid, **todo.dict())
    todos.append(new_todo)
    nextid += 1
    return new_todo

@app.get("/todos", response_model=List[Todo])
def get_todo_list():
    return todos

@app.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id:int):
    for todo in todos:
        if todo.id == todo_id:
            return todo
    raise HTTPException(status_code=404, detail="Todo не найдено")

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id:int, updated:CreateTodo):
    for idx, todo in enumerate(todos):
        if todo.id == todo_id:
            todos[idx] = Todo(id=todo_id, **updated.dict())
            return todos[idx]
    raise HTTPException(status_code=404, detail="Todo не найдено")

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id:int):
    for idx, todo in enumerate(todos):
        if todo.id == todo_id:
            todos.pop(idx)
            return {"message":"Deleted successfully"}
    raise HTTPException(status_code=404, detail="Todo не найдено")
