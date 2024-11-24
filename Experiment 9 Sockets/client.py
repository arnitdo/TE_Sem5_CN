import socket
import time

def client():
    s = socket.socket() 
    s.connect(('127.0.0.1', 5001)) 
    s.settimeout(1)
    messages = ["1", "2", "3", "4"]
    
    for message in messages:
        sent = False

        while not sent:
            try:
                print(f"sending: {message}")
                s.send(message.encode())

                ack = s.recv(1024).decode()

                if ack == "ACK":
                    print(f"received: {ack}")
                    sent = True  
                else:
                    print("resending")

            except socket.timeout:
                print(f"timeout")

        time.sleep(1)

    s.close() 

if __name__ == '__main__':
    client()
