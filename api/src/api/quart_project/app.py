from quart import Quart
from api.quart_project.routes import setup_routes

app = Quart(__name__)

def run():
    app = create_app()
    app.run(host='0.0.0.0', port=5000)

def create_app():
    setup_routes(app)
    return app
