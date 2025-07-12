#!/bin/sh

# Set defaults if needed
: "${METRICS_USERNAME:=admin}"
: "${METRICS_PASSWORD:=secret}"

# Replace vars manually using Bash
cat /etc/prometheus/prometheus.tpl.yml \
  | sed "s|\${METRICS_USERNAME}|$METRICS_USERNAME|g" \
  | sed "s|\${METRICS_PASSWORD}|$METRICS_PASSWORD|g" \
  > /etc/prometheus/prometheus.yml

# Lancer Prometheus avec le bon fichier
exec /bin/prometheus --config.file=/etc/prometheus/prometheus.yml