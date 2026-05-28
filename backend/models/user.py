class User:
    def __init__(self, user_id, name, email, password_hash):
        self.id = user_id
        self.name = name
        self.email = email
        self.password_hash = password_hash

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password_hash": self.password_hash
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data["id"],
            name=data["name"],
            email=data["email"],
            password_hash=data["password_hash"]
        )