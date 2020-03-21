import sqlite3, json
from sqlite3 import error

def create_connection(database):
	try:
		conn = sqlite3.connect(database,isolation_level=None, check_same_thread = False)
		conn.row_factory = lambda c, r: dict(zip(col[0] for col in c.description, r))

		return conn 
	except Error as e:
		print(e)

def create_table(c):
	sql = """
		CREATE TABLE IF NOT EXISTS polls (
		id integer PRIMARY KEY,
		name varchar(225) NOT NULL,
		votes NOT NULL Default 0
		);


c.execute(sql)

def create_poll(c,poll):
	sql = ''' INSERT INTO polls(name)
		VALUES (?) '''
	c.execute(sql,poll)

def update_poll(c, poll):
	sql = ''' UPDATE polls
		SET votes = votes+1 
		WHERE name = ? '''
	c.execute(sql, poll)

def select_all_polls(c, poll):
        sql = ''' SELECT * FROM polls '''
        c.execute(sql)

        rows = c.fetchall()
        rows.append({'name' : name})
        return json.dumps(rows)

def main():
        database = "./pysqlDatank.db"
        conn = create_connection(database)
        create_table(conn)
        create_item(conn, ["Go"])
        create_item(conn, ["Python"])
        create_item(conn, ["PHP"])
        create_item(conn, ["Ruby"])
        print("Connection established!")

    if __name__ == '__main__':
        main()