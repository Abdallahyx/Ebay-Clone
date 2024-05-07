from rest_framework import permissions


class IsNotAuthenticated(permissions.BasePermission):
    """
    Global permission to check user authentication status.
    You can block access to some urls for authenticated
    users.
    """

    def has_permission(self, request, view):
        if request in permissions.SAFE_METHODS:
            return True

        return bool(not request.user.is_authenticated)


class IsNotAuthenticatedOrIsCustomer(permissions.BasePermission):
    """
    Custom permission to allow access to unauthenticated users or customers
    """

    def has_permission(self, request, view):
        return not request.user.is_authenticated or (
            request.user.groups.filter(name="Customers").exists()
            and not request.user.groups.filter(name="Stores").exists()
        )


class IsStore(permissions.BasePermission):
    """
    Custom permission to only allow sellers to access the view
    """

    def has_permission(self, request, view):
        return request.user.groups.filter(name="Stores").exists()


class IsCustomer(permissions.BasePermission):
    """
    Custom permission to only allow buyers to access the view
    """

    def has_permission(self, request, view):
        return request.user.groups.filter(name="Customers").exists()
