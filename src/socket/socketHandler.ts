import { Socket } from "socket.io";
import { UserManagers } from "../managers/UserManager";

export class SocketHandler {
    private userManager: UserManagers;
    constructor() {
        this.userManager = new UserManagers();
    }
    handleJoinRoom(socket: Socket, name: string) {
        this.userManager.addUser(socket, name);
    }

    handleLeaveRoom(socket: Socket,name:String) {
        this.userManager.removeUser(socket.id);
    }
    handleDisconnect(socket: Socket) {
        this.userManager.removeUser(socket.id);
    }
}