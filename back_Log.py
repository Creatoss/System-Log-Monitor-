from flask import Flask, jsonify, request
from flask_cors import CORS
import re
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  

LOG_FILE = '/var/log/all-logs.log'
LOG_PATTERN = r'\[(.*?)\] (.*?) (.*?): (.*)'

class LogParser:
    @staticmethod
    def parse_line(line):
        """Parse a single log line into structured data"""
        match = re.match(LOG_PATTERN, line)
        if match:
            return {
                'timestamp': match.group(1),
                'hostname': match.group(2),
                'program': match.group(3),
                'message': match.group(4).strip(),
                'severity': LogParser.detect_severity(match.group(4))
            }
        return None

    @staticmethod
    def detect_severity(message):
        """Detect log severity from message content"""
        message_lower = message.lower()
        if 'error' in message_lower:
            return 'error'
        if 'warning' in message_lower:
            return 'warning'
        if 'failed' in message_lower:
            return 'critical'
        return 'info'

class LogManager:
    @staticmethod
    def get_logs(limit=None, filters=None):
        """Retrieve and filter logs from file"""
        logs = []
        filters = filters or {}
        
        try:
            with open(LOG_FILE, 'r') as f:
                lines = f.readlines()
                
                # Apply filters and parse
                for line in reversed(lines):
                    parsed = LogParser.parse_line(line)
                    if parsed and LogManager._matches_filters(parsed, filters):
                        logs.append(parsed)
                        if limit and len(logs) >= limit:
                            break
                            
        except FileNotFoundError:
            app.logger.error(f"Log file {LOG_FILE} not found")
        except Exception as e:
            app.logger.error(f"Error reading logs: {str(e)}")
            
        return logs[::-1]  # Return in chronological order

    @staticmethod
    def _matches_filters(log_entry, filters):
        """Check if log entry matches all filters"""
        for key, value in filters.items():
            if key == 'timestamp':
                if not LogManager._filter_timestamp(log_entry[key], value):
                    return False
            elif str(log_entry.get(key, '')).lower() != str(value).lower():
                return False
        return True

    @staticmethod
    def _filter_timestamp(log_timestamp, filter_date):
        """Filter by date (YYYY-MM-DD format)"""
        try:
            log_date = datetime.strptime(log_timestamp, '%Y-%m-%d %H:%M:%S')
            filter_date = datetime.strptime(filter_date, '%Y-%m-%d')
            return log_date.date() == filter_date.date()
        except ValueError:
            return False

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Endpoint to retrieve logs with filters"""
    try:
        filters = {
            'hostname': request.args.get('hostname'),
            'program': request.args.get('program'),
            'severity': request.args.get('severity'),
            'timestamp': request.args.get('date')
        }
        
        # Remove empty filters
        filters = {k: v for k, v in filters.items() if v is not None}
        
        limit = request.args.get('limit', default=100, type=int)
        
        logs = LogManager.get_logs(limit=limit, filters=filters)
        return jsonify({
            'success': True,
            'count': len(logs),
            'logs': logs
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Endpoint for log statistics"""
    logs = LogManager.get_logs()
    
    stats = {
        'total_logs': len(logs),
        'hosts': {},
        'programs': {},
        'severity': {
            'critical': 0,
            'error': 0,
            'warning': 0,
            'info': 0
        }
    }
    
    for log in logs:
        # Host stats
        stats['hosts'][log['hostname']] = stats['hosts'].get(log['hostname'], 0) + 1
        
        # Program stats
        stats['programs'][log['program']] = stats['programs'].get(log['program'], 0) + 1
        
        # Severity stats
        stats['severity'][log['severity']] += 1
    
    return jsonify({
        'success': True,
        'stats': stats
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
