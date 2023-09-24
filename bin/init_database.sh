#!/bin/bash

cat mysql/init.sql | docker compose exec -T mysql mysql -u test --user=root --password=password