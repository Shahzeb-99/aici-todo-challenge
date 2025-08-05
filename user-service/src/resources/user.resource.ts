export class UserResource {
    id: number;
    user_email: string;

    constructor(user: any) {
        this.id = user.id;
        this.user_email = user.user_email;
    }
}