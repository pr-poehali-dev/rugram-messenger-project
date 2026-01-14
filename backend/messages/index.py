"""API для обмена сообщениями в РУграм"""
import json
import os
import psycopg2
from datetime import datetime

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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            chat_id = event.get('queryStringParameters', {}).get('chat_id')
            user_id = event.get('queryStringParameters', {}).get('user_id', '1')
            
            if chat_id:
                cur.execute("""
                    SELECT m.id, m.text, m.sender_id, m.created_at, u.username, u.avatar
                    FROM messages m
                    JOIN users u ON m.sender_id = u.id
                    WHERE m.chat_id = %s
                    ORDER BY m.created_at ASC
                """, (chat_id,))
                
                messages = []
                for row in cur.fetchall():
                    messages.append({
                        'id': row[0],
                        'text': row[1],
                        'sender_id': row[2],
                        'time': row[3].strftime('%H:%M'),
                        'sender': row[4],
                        'avatar': row[5],
                        'is_mine': str(row[2]) == str(user_id)
                    })
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'messages': messages}),
                    'isBase64Encoded': False
                }
            else:
                user_id = event.get('queryStringParameters', {}).get('user_id', '1')
                
                cur.execute("""
                    SELECT DISTINCT c.id, 
                        CASE 
                            WHEN c.is_group THEN c.name
                            ELSE (
                                SELECT u2.username 
                                FROM chat_members cm2
                                JOIN users u2 ON cm2.user_id = u2.id
                                WHERE cm2.chat_id = c.id AND cm2.user_id != %s
                                LIMIT 1
                            )
                        END as name,
                        CASE 
                            WHEN c.is_group THEN '🎮'
                            ELSE (
                                SELECT u2.avatar 
                                FROM chat_members cm2
                                JOIN users u2 ON cm2.user_id = u2.id
                                WHERE cm2.chat_id = c.id AND cm2.user_id != %s
                                LIMIT 1
                            )
                        END as avatar,
                        (SELECT m.text FROM messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
                        (SELECT m.created_at FROM messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_time
                    FROM chats c
                    JOIN chat_members cm ON c.id = cm.chat_id
                    WHERE cm.user_id = %s
                    ORDER BY last_time DESC NULLS LAST
                """, (user_id, user_id, user_id))
                
                chats = []
                for row in cur.fetchall():
                    last_time = row[4]
                    if last_time:
                        now = datetime.now()
                        if last_time.date() == now.date():
                            time_str = last_time.strftime('%H:%M')
                        else:
                            time_str = 'Вчера'
                    else:
                        time_str = ''
                    
                    chats.append({
                        'id': row[0],
                        'name': row[1] or 'Новый чат',
                        'avatar': row[2] or '👤',
                        'lastMessage': row[3] or 'Нет сообщений',
                        'time': time_str,
                        'unread': 0
                    })
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'chats': chats}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            chat_id = body.get('chat_id')
            sender_id = body.get('sender_id', 1)
            text = body.get('text')
            
            if not chat_id or not text:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'chat_id and text are required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO messages (chat_id, sender_id, text)
                VALUES (%s, %s, %s)
                RETURNING id, created_at
            """, (chat_id, sender_id, text))
            
            result = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': result[0],
                    'time': result[1].strftime('%H:%M'),
                    'success': True
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
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
