import { User } from "./UserManager";


let GLOBAL_ROOM_ID = 1;

interface Room {
    user1: User;
    user2: User;
    roomId: String;
}

export class RoomManger {
    private rooms : Map<String,Room>
    constructor() { 
        this.rooms = new Map<String,Room>();
    }
    createRoom(user1: User, user2: User) {
        const roomId = this.generate();
        this.rooms.set(roomId.toString(), { user1, user2, roomId: roomId.toString() })
        
        user1?.socket.emit("new-room", {
            type: "send-offer",
            roomId: roomId.toString()
        })
        user2?.socket.emit("new-room",{
            type: "receive-offer",
            roomId: roomId.toString()
        })
    }
        onOffer(roomId:String, sdp:String) {
            const user2 = this.rooms.get(roomId.toString())?.user2;
            user2?.socket.emit("offer", {
                sdp
            })
        }

        onAnswer(roomId: String, sdp: String) {
            const user1 = this.rooms.get(roomId.toString())?.user1;
            user1?.socket.emit("answer", {
                sdp
            })
         }

        onIceCandidate(roomId: String, candidate: object, senderSocketId: string) {
            const room = this.rooms.get(roomId.toString());
            if (!room) return;
            const target = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
            target?.socket.emit("ice-candidate", { candidate });
        }

    generate() { 
        return GLOBAL_ROOM_ID++;
    }
}