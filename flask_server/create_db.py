import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    port = 3306,
    user="muskan",
    passwd="muskan123"
)

my_cursor = mydb.cursor()
my_cursor.execute("SHOW DATABASED")
for db in my_cursor:
    print(db)