import os
from app import create_app

app = create_app() 

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 2000))
    app.run(debug=False, port=port, host='0.0.0.0')
