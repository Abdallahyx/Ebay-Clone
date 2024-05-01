from rest_framework.response import Response


class TokenCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Check if the response is a DRF Response and contains a token
        if (
            isinstance(response, Response)
            and response.data is not None
            and "token" in response.data
        ):
            # Set the token as a cookie
            response.set_cookie("token", response.data["token"])

        return response
