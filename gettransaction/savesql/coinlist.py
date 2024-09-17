import requests
import json
import mysql.connector
from datetime import datetime

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'your_database_name'
}


cron_job_time = '*/5 * * * *'

def get_data_from_json(url):
    try:
        response = requests.get(url)
        return json.loads(response.text)
    except Exception as e:
        print(f"Error: {e}")
        return None

def save_to_database(data, db_config):
    try:
        cnx = mysql.connector.connect(**db_config)
        cursor = cnx.cursor()
        
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS data (
                id INT AUTO_INCREMENT,
                symbol VARCHAR(255),
                decimals INT,
                description TEXT,
                logoURI VARCHAR(255),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB;
        ''')
        
        
        for token in data:
            cursor.execute('''
                INSERT INTO data (id, symbol, decimals, description, logoURI) 
                VALUES (%s, %s, %s, %s, %s)
            ''', (token['id'], token['symbol'], token.get('decimals'), token.get('description'), token.get('logoURI')))
        
        cnx.commit()
        cursor.close()
        cnx.close()
    except Exception as e:
        print(f"Error: {e}")

def main():
    url = 'https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json'
    data = get_data_from_json(url)
    
    if data is not None:
        save_to_database(data, db_config)

if __name__ == '__main__':
    print(f"Cron job running: {datetime.now()}")
    main()