# Amazon to eBay Tracking Conversion SaaS

A powerful SaaS platform that automates the process of converting Amazon tracking numbers into eBay-compatible tracking to streamline dropshipping order fulfillment.

## Features

- Automatic Amazon tracking conversion for eBay sellers
- eBay API integration for order syncing
- Bulk tracking uploads via CSV
- Multi-account support
- Real-time tracking updates
- Analytics dashboard

## Tech Stack

### Backend

- Django REST Framework
- Celery (background tasks)
- PostgreSQL
- Redis
- eBay Developer API

### Frontend

- Next.js
- Tailwind CSS
- TypeScript

## Setup Instructions

### Backend Setup

1. Create and activate virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations:

```bash
cd trackerbot_backend
python manage.py migrate
```

5. Start the development server:

```bash
python manage.py runserver
```

6. Start Celery worker:

```bash
celery -A trackerbot_backend worker -l info
```

### Frontend Setup

1. Install dependencies:

```bash
cd trackerbot_frontend
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Start the development server:

```bash
npm run dev
```

## API Documentation

API documentation is available at `/api/docs/` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
