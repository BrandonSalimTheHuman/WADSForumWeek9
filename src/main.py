from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3

#connect to database
conn = sqlite3.connect('todolistdatabase.db')

#define model
class Task(BaseModel):
    id: str
    name: str
    completed: bool
    user_id: str

#initialize FastAPI
app = FastAPI()

#Initialize APIRouter
router = APIRouter()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

#endpoint to retrieve all tasks
@router.get("/tasks", response_model=List[Task], summary="Get all tasks", description="Returns a list of all tasks in the database.")
async def read_all_tasks():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks_from_db = cursor.fetchall()
    cursor.close()

    tasks = []
    for task_row in tasks_from_db:
        task = Task(id=str(task_row[0]), name=task_row[1], completed=task_row[2], user_id=str(task_row[3]))
        tasks.append(task)

    return tasks

#endpoint to retrieve all tasks of a certain user id
@router.get("/tasks/{user_id}", response_model=List[Task], summary="Get tasks by user ID", description="Returns a list of tasks for the specified user.")
async def read_tasks_for_user(user_id: str):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE user_id = ?", (user_id,))
    tasks_from_db = cursor.fetchall()
    cursor.close()

    tasks = []
    for task_row in tasks_from_db:
        task = Task(id=str(task_row[0]), name=task_row[1], completed=task_row[2], user_id=str(task_row[3]))
        tasks.append(task)

    return tasks

#endpoint to create a new task
@router.post("/tasks", response_model=Task, summary="Create a new task", description="Creates a new task with the specified name for the given user.")
async def create_task(task_name: str, user_id: str, task_id: str):
    cursor = conn.cursor()
    task = Task(id=task_id, name=task_name, completed=False, user_id=user_id)

    query = "INSERT INTO tasks (id, name, completed, user_id) VALUES (?, ?, ?, ?)"

    cursor.execute(query, (task.id, task.name, task.completed, task.user_id))
    conn.commit()
    cursor.close()

    return task

#endpoint to get a certain task based on id
@router.get("/tasks/{task_id}", response_model=Task, summary="Get task by ID", description="Returns the task with the specified ID.")
async def read_task(task_id: str):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task_row = cursor.fetchone()
    cursor.close()

    if task_row:
        return Task(id=str(task_row[0]), name=task_row[1], completed=task_row[2], user_id=str(task_row[3]))
    else:
        raise HTTPException(status_code=404, detail="Task not found")

#endpoint to update task name for a certain task
@router.put("/tasks/{task_id}", response_model=Task, summary="Update task name", description="Updates the name of the task with the specified ID.")
async def update_task(task_id: str, new_task_name: str):
    cursor = conn.cursor()
    cursor.execute("UPDATE tasks SET name = ? WHERE id = ?", (new_task_name, task_id))
    conn.commit()
    cursor.close()

    # Fetch and return the updated task after the update
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, completed, user_id FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    cursor.close()

    if row:
        updated_task = Task(id=str(row[0]), name=row[1], completed=row[2], user_id=row[3])
        return updated_task
    else:
        raise HTTPException(status_code=404, detail="Task not found")

#endpoint to toggle completion of a certain task
@router.put("/tasks/{task_id}/toggle_completion", response_model=Task, summary="Toggle task completion", description="Toggles the completion status of the task with the specified ID.")
async def toggle_task_completion(task_id: str):
    # Get the task from the database
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task_row = cursor.fetchone()
    
    # Check if the task exists
    if task_row:
        # Toggle the completion status
        updated_completion = not task_row[2]  # Toggle completion status
        
        # Update the task in the database
        cursor.execute("UPDATE tasks SET completed = ? WHERE id = ?", (updated_completion, task_id))
        conn.commit()
        cursor.close()
        
        # Return the updated task
        updated_task = Task(id=str(task_row[0]), name=task_row[1], completed=updated_completion, user_id=str(task_row[3]))
        return updated_task
    else:
        # Task not found
        raise HTTPException(status_code=404, detail="Task not found")

#endpoint to delete a task
@router.delete("/tasks/{task_id}", summary="Delete task", description="Deletes the task with the specified ID.")
async def delete_task(task_id: str):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    cursor.close()

    return {"message": "Task deleted successfully"}

#mount router
app.include_router(router, prefix="/api")
