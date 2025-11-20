#!/bin/sh

# Wait for database to be ready
# Usage: ./wait-for-db.sh host port

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until pg_isready -h "$host" -p "$port" -U plebschool -d pleb_school; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd 
