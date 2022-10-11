export class ResponseSignUpDto {
    readonly id: string;
    readonly hospital: string;
    readonly license: string;
    readonly email: string;
    readonly password: string;

    constructor(body: any) {
        this.id = body.id;
        this.hospital = body.hospital;
        this.license = body.license;
        this.email = body.email;
        this.password = body.password;
    }
}
