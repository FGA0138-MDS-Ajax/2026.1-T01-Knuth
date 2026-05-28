import bcrypt

class PasswordService:

    @staticmethod
    def hash_password(password: str) -> str:
        if not isinstance(password, str):
            raise TypeError("Password must be a string")

        return bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        try:
            return bcrypt.checkpw(
                password.encode("utf-8"),
                hashed_password.encode("utf-8")
            )
        except Exception:
            return False