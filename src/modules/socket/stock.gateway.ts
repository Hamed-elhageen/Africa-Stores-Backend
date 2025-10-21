import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket, ...args: any[]) {
        // check toke n
        const authheader = client.handshake.auth?.authorization;
        if(!authheader || !authheader.startsWith('Bearer ')) {
            throw new Error('Unauthorized');
        }
        const token = authheader.split(' ')[1];
        

    }

    handleDisconnect(client: any) {

    }

}