"""Инициализация начальных чатов для пользователя"""
import json
import os
import psycopg2

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def handler(event, context):
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        user_id = body.get('user_id', 1)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT COUNT(*) FROM chat_members WHERE user_id = %s", (user_id,))
        existing_chats = cur.fetchone()[0]
        
        if existing_chats > 0:
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Chats already initialized', 'count': existing_chats}),
                'isBase64Encoded': False
            }
        
        other_users = [2, 3, 4, 5]
        created_chats = 0
        
        for other_user_id in other_users:
            cur.execute("""
                INSERT INTO chats (name, is_group) 
                VALUES (NULL, false) 
                RETURNING id
            """)
            chat_id = cur.fetchone()[0]
            
            cur.execute("""
                INSERT INTO chat_members (chat_id, user_id) 
                VALUES (%s, %s), (%s, %s)
            """, (chat_id, user_id, chat_id, other_user_id))
            
            initial_messages = {
                2: "Привет! Как дела?",
                3: "Собираемся в 20:00",
                4: "Отправил файлы",
                5: "Супер! Давай встретимся"
            }
            
            cur.execute("""
                INSERT INTO messages (chat_id, sender_id, text)
                VALUES (%s, %s, %s)
            """, (chat_id, other_user_id, initial_messages[other_user_id]))
            
            created_chats += 1
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'created_chats': created_chats}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
