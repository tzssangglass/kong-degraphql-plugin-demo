#!/bin/bash

# 设置变量
SERVICE_NAME="graphql"
SERVICE_URL="http://graphql-server:4000"
ROUTE_PATH="/"
DEGRAPHQL_ROUTE_URI="/beast/:categoryId/:id"
DEGRAPHQL_QUERY='query($categoryId: String!, $id: String!) {
  beast(categoryId: $categoryId, id: $id) {
    id
    commonName
    binomial
    legs
  }
}'

# 1. insert Service
echo "Inserting service..."
curl -i -X POST http://localhost:8001/services/ \
  --data "name=$SERVICE_NAME" \
  --data "url=$SERVICE_URL"

# 2. insert Route
echo "Inserting route..."
curl -i -X POST http://localhost:8001/services/$SERVICE_NAME/routes \
  --data "paths[]=$ROUTE_PATH"

# 3. insert Plugin
echo "Inserting plugin..."
curl -i -X POST http://localhost:8001/services/$SERVICE_NAME/plugins/ \
  --data "name=degraphql" \
  --data "config.graphql_server_path=/graphql"

# 4. insert DeGraphQL Route
echo "Inserting degraphql route..."
curl -i -X POST http://localhost:8001/services/$SERVICE_NAME/degraphql/routes \
  --data "uri=$DEGRAPHQL_ROUTE_URI" \
  --data "query=$DEGRAPHQL_QUERY"

# 5. trigger the request
echo "Triggering the request..."
curl -i -X GET http://localhost:8000/beast/insects/md