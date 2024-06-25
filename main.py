from minecraft.networking.connection import Connection
from minecraft.networking.packets import clientbound, serverbound

class Bot:
    def __init__(self, server, port, username):
        self.connection = Connection(
            server, port, username=username)
        self.connection.register_packet_listener(
            self.on_join_game, clientbound.play.JoinGamePacket)
        self.connection.register_packet_listener(
            self.on_chat_message, clientbound.play.ChatMessagePacket)
        self.connection.connect()

    def on_join_game(self, packet):
        print("Joined the game!")
        self.send_message("Hello, I am a bot!")

    def on_chat_message(self, packet):
        message = packet.json_data['extra'][0]['text']
        print(f"Received chat message: {message}")

    def send_message(self, message):
        chat_packet = serverbound.play.ChatPacket()
        chat_packet.message = message
        self.connection.write_packet(chat_packet)

if __name__ == "__main__":
    server = input("Nhập địa chỉ IP của server: ")
    port = int(input("Nhập cổng của server (port): "))
    username = input("Nhập tên người dùng của bot: ")
    bot = Bot(server, port, username)
