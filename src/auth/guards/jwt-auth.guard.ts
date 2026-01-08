import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";


// What is the meaning of this : @Injectable()? Without any parameter?
// This is a simple who acccept all requests
export class authGuard implements CanActivate { // Why use implements CanActivate ?
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return true
    }
}