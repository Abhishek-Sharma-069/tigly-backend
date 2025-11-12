import { Socket } from 'socket.io';
import { RoomManger } from './RoomMangaer';

export interface User{
    socket: Socket;
    name: string;
}
let GLOBAL_ROOM_ID = 1;

export class UserManagers{
    private users: User[] = [];
    private queue: String[] = [];
    private roomManger: RoomManger;
    constructor() {
        this.users = [];
        this.roomManger = new RoomManger();
    }

    addUser(socket: Socket, name: string) {
        this.users.push({ socket, name });
        this.queue.push(socket.id);
        this.clearQueue();
        this.initHandler(socket);
     }
    removeUser(socketId: string) {
        this.users = this.users.filter(user => user.socket.id !== socketId);
        this.queue = this.queue.filter(id => id !== socketId);
        
    }
    
    clearQueue() { 
        if (this.queue.length < 2) {
            return;
        }

        const user1 = this.users.find(x => x.socket.id === this.queue.pop());
        const user2 = this.users.find(x => x.socket.id === this.queue.pop());
        if (user1 && user2) {
           const room = this.roomManger.createRoom(user1, user2);

        }
    }
    generate() { 
        return GLOBAL_ROOM_ID++;
    }
    initHandler(socket: Socket) { 
        socket.on("offer", ({ sdp, roomId }) => {
            this.roomManger.onOffer(roomId, sdp);
        })
        socket.on("answer", ({ roomId, sdp }) => {
            this.roomManger.onAnswer(roomId, sdp);
        })
    }
}