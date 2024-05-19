from flask import request, jsonify
from functools import wraps

class AuthenticationMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Extract the token from the request (e.g., from headers)
        token = scope.get("headers", {}).get(b"authorization", b"").decode("utf-8")
        print("Worked")
        # Validate the token (e.g., JWT validation)
        if True:
            # Token is valid, proceed with the request
            await self.app(scope, receive, send)
        else:
            # Token is invalid, return an unauthorized response
            await send({"type": "http.response.start", "status": 401})
            await send({"type": "http.response.body", "body": b"Unauthorized"})