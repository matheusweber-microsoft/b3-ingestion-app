import logging
import os


class Logger:
    def __init__(self):
        self.logger = logging.getLogger()
        log_level = os.getenv('LOG_LEVEL', 'INFO')
        self.logger.setLevel(getattr(logging, log_level))

    def info(self, message):
        logging.info(message)

    def error(self, message):
        logging.error(message)

    def warning(self, message):
        logging.warning(message)    