/**
      * Represents a resource for the Todo entity.
      * This class is used to transform todo data into a specific format.
      */
     export class TodoResource {
         /**
          * The unique identifier of the todo.
          */
         uuid: string;

         /**
          * The numeric id of the todo.
          */
         id: number;

         /**
          * The content of the todo.
          */
         content: string;

         /**
          * Constructs a new TodoResource instance.
          *
          * @param {any} todo - The todo object containing raw todo data.
          */
         constructor(todo: any) {
             this.id = todo.id;
             this.uuid = todo.uuid;
             this.content = todo.content;
         }
     }