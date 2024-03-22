from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import get_authorization_header
from django.utils.translation import gettext as _


class CustomTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        # Try to get the token from the 'Authorization' header
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b"token":
            # If the token is not in the header, try to get it from the cookie
            token = request.COOKIES.get("token")
            if not token:
                return None
            token_obj = self.get_model().objects.select_related("user").get(key=token)
            return token_obj.user, token

        if len(auth) == 1:
            msg = _("Invalid token header. No credentials provided.")
            raise AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _("Invalid token header. Token string should not contain spaces.")
            raise AuthenticationFailed(msg)

        return self.authenticate_credentials(auth[1])
