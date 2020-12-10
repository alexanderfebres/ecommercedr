FROM python:3.8.6-alpine3.11
ENV PYTHONUNBUFFERED 1
RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt /backend/
RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    apk --update add libxml2-dev libxslt-dev libffi-dev gcc musl-dev libgcc openssl-dev curl && \
    apk add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev && \
    python3 -m pip install -r requirements.txt --no-cache-dir 

# EXPOSE 8000
COPY . /backend/
CMD ["sh","-c","python manage.py makemigrations && python manage.py migrate && echo \"from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@example.com', is_superuser=True).delete(); User.objects.create_superuser('admin', 'admin@example.com', 'nimda')\" | python manage.py shell && gunicorn home.wsgi.prod:application --bind 0.0.0.0:$PORT --timeout 120 --workers=3 --threads=3 --worker-connections=1000"]