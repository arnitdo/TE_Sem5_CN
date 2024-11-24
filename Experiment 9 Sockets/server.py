import socket
import random

def server():
    s = socket.socket()  
    s.bind(('127.0.0.1', 5001)) 

    s.listen(1)
    conn, _ = s.accept()

    while True:
        data = conn.recv(1024).decode()

        if not data:
            break
        
        print(f"received: {data}")
        
        if random.choice([True, True, False]):
            conn.send("ACK".encode())
            print("ACK sent")
        else:
            print("ACK dropped")

    conn.close()

if __name__ == '__main__':
    server()