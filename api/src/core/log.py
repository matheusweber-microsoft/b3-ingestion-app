import logging
import os

from src.infra.keyVault.keyVault import KeyVault
from opencensus.ext.azure.log_exporter import AzureLogHandler

class Logger:
    def __init__(self):
        keyVault = KeyVault()
        self.logger = logging.getLogger()
        if not self.logger.handlers:
            log_level = os.getenv('LOG_LEVEL', 'INFO')
            self.logger.setLevel(getattr(logging, log_level))
            handler = AzureLogHandler(connection_string=keyVault.get_secret(os.getenv('KEY_VAULT_APPLICATION_INSIGHTS_NAME')))
            formatter = logging.Formatter('%(filename)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def info(self, message):
        self.logger.info(message)

    def error(self, message):
        self.logger.error(message)

    def warning(self, message):
        self.logger.warning(message)