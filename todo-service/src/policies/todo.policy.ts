// src/policies/todo.policy.ts
         import { Todo } from '../models/todo.model';

         export class TodoPolicy {
             /**
              * Determines if a user can create a todo.
              * @param {string} user_uuid - The UUID of the user.
              * @returns {boolean}
              */
             static canCreate(user_uuid: string): boolean {
                 return !!user_uuid;
             }

             /**
              * Determines if a user can view a todo.
              * @param {Todo} todo - The todo item.
              * @param {string} user_uuid - The UUID of the user.
              * @returns {boolean}
              */
             static canView(todo: Todo, user_uuid: string): boolean {
                 return todo.user_uuid === user_uuid;
             }

             /**
              * Determines if a user can update a todo.
              * @param {Todo} todo - The todo item.
              * @param {string} user_uuid - The UUID of the user.
              * @returns {boolean}
              */
             static canUpdate(todo: Todo, user_uuid: string): boolean {
                 return todo.user_uuid === user_uuid;
             }

             /**
              * Determines if a user can delete a todo.
              * @param {Todo} todo - The todo item.
              * @param {string} user_uuid - The UUID of the user.
              * @returns {boolean}
              */
             static canDelete(todo: Todo, user_uuid: string): boolean {
                 return todo.user_uuid === user_uuid;
             }
         }