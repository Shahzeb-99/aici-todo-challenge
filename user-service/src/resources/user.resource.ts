/**
 * Represents a resource for the User entity.
 * This class is used to transform user data into a specific format.
 */
export class UserResource {
    /**
     * The unique identifier of the user.
     */
    id: number;

    /**
     * The email address of the user.
     */
    user_email: string;

    /**
     * Constructs a new UserResource instance.
     *
     * @param {any} user - The user object containing raw user data.
     */
    constructor(user: any) {
        this.id = user.id;
        this.user_email = user.user_email;
    }
}