import logging
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

class Logger:
    def __init__(self):
        os.environ["OTEL_SERVICE_NAME"] = "ingestion-api"
        self.logger = logging.getLogger()
        if not self.logger.handlers:
            log_level = os.getenv('LOG_LEVEL', 'INFO')
            self.logger.setLevel(getattr(logging, log_level))
            
            # Azure log handler
            azure_log_handler_connection_string = os.getenv('APP_INSIGHTS_CONN_STRING')
            exporter = AzureMonitorTraceExporter.from_connection_string(
                conn_str=azure_log_handler_connection_string
            )
            trace.set_tracer_provider(TracerProvider())
            trace.get_tracer_provider().add_span_processor(
                BatchSpanProcessor(exporter)
            )

            formatter = logging.Formatter('%(filename)s - %(levelname)s - %(message)s')

            # Stream handler
            stream_handler = logging.StreamHandler()
            stream_handler.setFormatter(formatter)
            self.logger.addHandler(stream_handler)

    def info(self, message):
        with trace.get_tracer(__name__).start_as_current_span("info"):
            self.logger.info(message)

    def error(self, message):
        with trace.get_tracer(__name__).start_as_current_span("error"):
            self.logger.error(message)

    def warning(self, message):
        with trace.get_tracer(__name__).start_as_current_span("warning"):
            self.logger.warning(message)