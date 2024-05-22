class Role:
    def __init__(self, name):
        self.name = name

class User:
    def __init__(self, dict):
        self.username = dict['preferred_username']
        self.roles = [Role(role) for role in dict['roles']]
    
    def isAdmin(self):
        return 'DocumentsManager.Admin' in [role.name for role in self.roles]

        