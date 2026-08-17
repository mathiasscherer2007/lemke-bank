import crypto from "node:crypto"
import { UserLoginDTO, UserSignupDTO } from "../Dto/Request.js";
import { ConfirmPasswordDoNotMatchException, EmailAlreadyExistsException, UserNotFoundException, WrongPasswordException } from "../Exception/DomainException.js";
import { User } from "../Model/User.js";
import { UserRepository } from "../Repository/User/UserRepository.js";
import { UserRole } from "../Model/Enum/UserRole.js";
import { TokenService } from "./TokenService/TokenService.js";
import { TokenType } from "../Model/Enum/TokenType.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";
import { Wallet } from "../Model/Wallet.js";
import { TokenBlacklistingService } from "./TokenBlacklistingService/TokenBlacklistingService.js";

export class AuthService 
{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly walletRepository: WalletRepository,
        private readonly tokenService: TokenService,
        private readonly tokenBlacklistingService: TokenBlacklistingService
    ){}

    public async register(payload: UserSignupDTO): Promise<{ 
        accessToken: string,
        accessTokenTTL: number,
        refreshToken: string, 
        refreshTokenTTL: number,
        user: User
    }>
    {
        const { username, email, password, confirmPassword } = payload;

        const emailExists = await this.userRepository.findByEmail(email);
        if(emailExists) throw new EmailAlreadyExistsException(email);

        if(password !== confirmPassword){
            throw new ConfirmPasswordDoNotMatchException();
        }

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        const user = new User(
            email,
            passwordHash,
            username,
            UserRole.USER
        );

        await this.userRepository.save(user);

        const wallet = new Wallet(user.getId());
        await this.walletRepository.create(wallet);

        const accessToken = this.tokenService.sign(user, TokenType.ACCESS_TOKEN);
        const refreshToken = this.tokenService.sign(user, TokenType.REFRESH_TOKEN);

        const loggedUserData = user.toPrimitives() as any;
        delete loggedUserData["passwordHash"];

        return {
            accessToken: accessToken,
            accessTokenTTL: this.tokenService.getAccessTokenTTL(),
            refreshToken: refreshToken,
            refreshTokenTTL: this.tokenService.getRefreshTokenTTL(),
            user: loggedUserData
        }
    }

    public async authenticate(payload: UserLoginDTO): Promise<{
        accessToken: string,
        accessTokenTTL: number,
        refreshToken: string, 
        refreshTokenTTL: number,
        user: User
    }>
    {
        const { email, password } = payload;

        const user = await this.userRepository.findByEmail(email);
        if(!user) throw new UserNotFoundException(undefined, email);

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        if(passwordHash !== user.getPasswordHash()){
            throw new WrongPasswordException();
        }

        const accessToken = this.tokenService.sign(user, TokenType.ACCESS_TOKEN);
        const refreshToken = this.tokenService.sign(user, TokenType.REFRESH_TOKEN);

        const loggedUserData = user.toPrimitives() as any;
        delete loggedUserData["passwordHash"];

        return {
            accessToken: accessToken,  
            accessTokenTTL: this.tokenService.getAccessTokenTTL(), 
            refreshToken: refreshToken,
            refreshTokenTTL: this.tokenService.getRefreshTokenTTL(),
            user: loggedUserData
        }
    }

    public async revokeToken(token: string): Promise<void>
    {
        const decodedToken = this.tokenService.decode(token);
        await this.tokenBlacklistingService.blacklist(decodedToken);
    }
}