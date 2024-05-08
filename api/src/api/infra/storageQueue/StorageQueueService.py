from api.infra.secrets import Secrets
from azure.storage.queue import QueueClient

class StorageQueueService:
    def __init__(self, queue_name):
        secrets = Secrets.getInstance()

        self.queue_client = QueueClient.from_connection_string(secrets.connection_string_azure_queue, queue_name)

    def send_message(self, message_dict):
        message = str(message_dict)  # Convert the dictionary to a string
        self.queue_client.send_message(message)