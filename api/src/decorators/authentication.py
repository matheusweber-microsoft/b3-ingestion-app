from functools import wraps
import os
import json
from quart import jsonify, request
import requests
from src.decorators.exceptions import AuthError
from jose import jwt
import logging

def requires_auth(f):
    @wraps(f)
    async def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        logging.info(f"Starting authentication...")
        if auth_header:
            logging.info("Authorization header found")
            bearer_token = auth_header.split(' ')[1]

            # Get the public keys from Microsoft's JWKS endpoint
            jsonurl = requests.get(f"https://login.microsoftonline.com/{os.getenv('TENANT_ID')}/discovery/v2.0/keys")
            jwks = jsonurl.json()

            # Get the unverified header of the JWT
            unverified_header = jwt.get_unverified_header(bearer_token)
            unverified_claims = jwt.get_unverified_claims(bearer_token)

            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }

            if rsa_key:
                logging.info("RSA Key found")
                try:
                    # Decode the token and verify its signature, issuer, and audience
                    payload = jwt.decode(
                        bearer_token,
                        rsa_key,
                        algorithms=["RS256"],
                        audience=os.getenv('MSAL_API_AUDIENCE'),
                        issuer=os.getenv('MSAL_ISSUER')
                    )
                    logging.info("Token decoded successfully")
                    # Extract the scopes from the payload
                    roles = payload['roles']
                    kwargs['roles'] = roles
                except jwt.ExpiredSignatureError:
                    logging.error("Token is expired")
                    response = jsonify({"code": "token_expired"})
                    response.status_code = 401
                    return response
                except jwt.JWTClaimsError:
                    logging.error("Incorrect claims")
                    response = jsonify({"code": "invalid_claims",
                                    "description":
                                    "incorrect claims,"
                                    "please check the audience and issuer"})
                    response.status_code = 401
                    return response
                except Exception:
                    logging.error("Unable to parse authentication token")
                    response = jsonify({"code": "invalid_header",
                                    "description":
                                    "Unable to parse authentication"
                                    " token."})
                    response.status_code = 401
                    return response
        else:
            logging.error("Unable to parse authentication token")
            response = jsonify({"code": "invalid_header",
                            "description":
                            "Unable to parse authentication"
                            " token."})
            response.status_code = 401
            return response
        
        return await f(*args, **kwargs)
    return decorated

def requires_role(roles):
    def decorator(f):
        @wraps(f)
        async def decorated(*args, **kwargs):
            logging.info("Checking roles...")
            if 'roles' in kwargs:
                user_roles = kwargs['roles']
                for role in roles:
                    if role in user_roles:
                        kwargs.pop('roles', [])
                        return await f(*args, **kwargs)
                logging.error("Unauthorized role")
                raise AuthError({"code": "unauthorized_role",
                                "description": "Unauthorized role"}, 403)
            else:
                logging.error("Roles not found")
                raise AuthError({"code": "roles_not_found",
                                "description": "Roles not found"}, 403)
        return decorated
    return decorator