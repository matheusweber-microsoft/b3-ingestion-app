from api.infra.secrets import Secrets
from azure.storage.queue import QueueClient
import json
import base64

class StorageQueueService:
    def __init__(self, queue_name):
        secrets = Secrets.getInstance()

        self.queue_client = QueueClient.from_connection_string(secrets.connection_string_azure_queue, queue_name)

    def send_message(self, message_dict):
        message = json.dumps(message_dict)
        message_bytes = message.encode('utf-8')  
        base64_bytes = base64.b64encode(message_bytes) 
        base64_message = base64_bytes.decode('utf-8')  
        self.queue_client.send_message(base64_message)