import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/auth/roles.decorator";
import { IsPublicKey } from "../decorators/auth/public.decorator";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector

    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(IsPublicKey, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;

        const req = context.switchToHttp().getRequest();
        const { user } = req
        const RequiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
        if (!RequiredRoles || RequiredRoles.length === 0) return true
        if (!user || !RequiredRoles.includes(user?.role)) {
            throw new UnauthorizedException("You are not authorized to perform this action");
        }
        return true;
    }

}