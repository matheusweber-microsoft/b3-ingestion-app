from azure.storage.queue import QueueClient
import json
import base64
import os
import logging

class StorageQueueService:
    def __init__(self, queue_name):
        logging.info(f"Creating StorageQueueService with queue name: {queue_name}")
        self.queue_client = QueueClient.from_connection_string(os.getenv('CONNECTION_STRING_AZURE_QUEUE'), queue_name)

    def send_message(self, message_dict):
        logging.info(f"Sending message to storage queue: {message_dict}")
        message = json.dumps(message_dict)
        message_bytes = message.encode('utf-8')  
        base64_bytes = base64.b64encode(message_bytes) 
        base64_message = base64_bytes.decode('utf-8')  
        self.queue_client.send_message(base64_message)
        print("Message sent to storage queue")