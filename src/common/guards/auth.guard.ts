import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { NotFoundError, Observable } from "rxjs";
import { TokenRepository } from "src/db/repos/token.repository";
import { UserRepository } from "src/db/repos/user.repository";
import { IsPublicKey } from "../decorators/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
        private readonly _UserRepository: UserRepository,
        private readonly _TokenRepository: TokenRepository,
        private readonly reflector: Reflector

    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(IsPublicKey, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);
        if (!token) {
            throw new UnauthorizedException("Token not found");
        }

        try {
            const payload = await this._jwtService.verify(token, {
                secret: this._configService.get<string>('TOKEN_SECRET')
            });
            const user = await this._UserRepository.findOne({ filter: { _id: payload.id } });
            if (!user) {
                throw new NotFoundException("User not found");
            }
            const tokenDoc = await this._TokenRepository.findOne({ filter: { token, isValid: true, user: user._id } });
            if (!tokenDoc) {
                throw new UnauthorizedException();
            }
            req['user'] = user;
            req['token'] = tokenDoc;
        }
        catch (error) {
            console.log(error);
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            }
            throw new InternalServerErrorException();
        }


        return true;
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type == 'Bearer' ? token : undefined
    }

}