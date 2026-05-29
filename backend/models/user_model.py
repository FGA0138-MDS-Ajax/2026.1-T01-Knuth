from database.database_controller import DatabaseController

class UserModel:
    def __init__(self):
        self.db = DatabaseController()

    def get_users(self):
        query = "SELECT * FROM users"
        return self.db.fetch_all(query)
    
    def get_users_by_email(self, email):
        query = """
        SELECT * FROM users
        WHERE email = %s;
        """
        return self.db.fetch_all(query, (email,))
    
    def create_user(self, name, email, password_hash):
        query = """
        INSERT INTO users (name, email, password_hash)
        VALUES (%s, %s, %s)
        """

        self.db.execute_query(query, (name, email, password_hash))