import React, {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import {MoreVertical, Pencil, Trash2} from "lucide-react";

type Todo = {
    uuid: string;
    id: number;
    content: string;
};

export function TodoGridPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8080/api/todo/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch todos");
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    setTodos(data.data);
                } else {
                    console.error("API error:", data.message);
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    }, []);

    const handleAddTodo = () => {
        if (!newTodo.trim()) {
            return
        }

        const token = localStorage.getItem("token");

        fetch("http://localhost:8080/api/todo/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({content: newTodo.trim()}),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to add todo");
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    setTodos((prev) => [...prev, data.data]);
                    setNewTodo("");
                } else {
                    console.error("API error:", data.message);
                }
            })
            .catch((error) => {
                console.error("Add todo error:", error);
            });
    };

    const handleUpdateTodo = (id: string) => {
        if (!newTodo.trim()){
            handleCardButton(id);
        }

        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/api/todo/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({content: newTodo.trim()}),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update todo");
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    setTodos((prev) =>
                        prev.map((todo) =>
                            todo.id === id ? {...todo, content: newTodo.trim()} : todo
                        )
                    );
                    setNewTodo("");
                } else {
                    console.error("API error:", data.message);
                }
            })
            .catch((error) => {
                console.error("Update todo error:", error);
            });
    };

    const handleCardButton = (id: string) => {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/api/todo/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed to delete todo");

                // Check if response has a JSON body
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return res.json();
                }

                // If no JSON body, return an empty object
                return {};
            })
            .then((data: any) => {
                if (data.success || Object.keys(data).length === 0) {
                    toast.success("Todo deleted successfully");
                    // Assume success if API is silent but deletion was OK
                    setTodos((prev) => prev.filter((todo) => todo.id !== id));
                } else {
                    console.error("API error:", data.message || "Unknown error");
                }
            })
            .catch((error) => {
                console.error("Delete todo error:", error.message || error);
            });
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Todo Grid</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost">Add Todo</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Todo</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Enter todo"
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <DialogTrigger asChild>
                                <Button onClick={handleAddTodo}>Add</Button>
                            </DialogTrigger>

                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {todos.map((todo) => (
                    <Card key={todo.uuid}>

                        <CardContent>
                            <div className="flex items-start justify-between">
                                <div className="mb-4 max-w-xs break-words">{todo.content}</div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                                            <MoreVertical className="w-5 h-5"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <DropdownMenuItem onSelect={e => {

                                                    setNewTodo(todo.content); // Pre-fill the input with the current todo content
                                                    e.preventDefault();
                                                }}>
                                                    <Pencil className="mr-2 w-4 h-4"/>
                                                    Edit
                                                </DropdownMenuItem>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Todo</DialogTitle>
                                                </DialogHeader>
                                                <Input
                                                    value={newTodo}
                                                    onChange={(e) => setNewTodo(e.target.value)}
                                                    placeholder="Enter todo"
                                                />
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>

                                                    <DialogTrigger asChild>
                                                        <Button
                                                            onClick={() => handleUpdateTodo(todo.id)}>Update</Button>
                                                    </DialogTrigger>

                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <DropdownMenuSeparator/>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem
                                                    onSelect={e => e.preventDefault()}
                                                >
                                                    <Trash2 className="mr-2 w-4 h-4"/>
                                                    Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your
                                                        todo.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleCardButton(todo.id)}>
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}