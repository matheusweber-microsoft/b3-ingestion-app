class Role:
    def __init__(self, name):
        self.name = name

class User:
    def __init__(self, dict):
        self.username = dict['preferred_username']
        self.roles = [Role(role) for role in dict['roles']]
        self.groups = [group for group in dict['groups']]
    
    def isAdmin(self):
        return 'DocumentsManager.Admin' in [role.name for role in self.roles]

        