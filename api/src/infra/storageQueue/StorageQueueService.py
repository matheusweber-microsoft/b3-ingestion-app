import json
import base64
import os
from src.core.log import Logger
from azure.storage.queue import QueueServiceClient

class StorageQueueService:
    def __init__(self, queue_name):
        self.logging = Logger()
        self.logging.info(f"SQS-1-INIT - Creating StorageQueueService with queue name: {queue_name}")
        self.queue_client = self.get_queue_client(queue_name)

    def get_queue_client(self, queue_name):
        azure_storage_connection_string = os.getenv('AZURE_STORAGE_ACCOUNT_CONN_STRING')
        queue_service_client = QueueServiceClient.from_connection_string(azure_storage_connection_string)
        return queue_service_client.get_queue_client(queue_name)
    
    def send_message(self, message_dict):
        self.logging.info(f"SQS-1-SM - Sending message to storage queue: {message_dict}")
        message = json.dumps(message_dict)
        message_bytes = message.encode('utf-8')  
        base64_bytes = base64.b64encode(message_bytes) 
        base64_message = base64_bytes.decode('utf-8')  
        self.queue_client.send_message(base64_message)
        self.logging.info("SQS-2-SM Message sent to storage queue")