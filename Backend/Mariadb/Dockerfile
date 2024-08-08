FROM mariadb:10.4

# Set environment variables
ENV MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=1

# Copy Schema.sql to Docker entrypoint directory
COPY Schema.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

# Start MariaDB
CMD ["mysqld"]