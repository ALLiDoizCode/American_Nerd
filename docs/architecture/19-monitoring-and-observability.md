# 19. Monitoring and Observability

[See detailed monitoring and observability document](./architecture/monitoring-and-observability.md)

**Summary:**
- **APM:** Datadog APM for backend tracing, Datadog RUM for frontend performance
- **Logs:** Winston structured logs → Datadog Logs
- **Metrics:** Custom business metrics (opportunities created, bids placed) via StatsD
- **Alerts:** PagerDuty for critical incidents, Slack for warnings
- **Smart Contract Monitoring:** Alchemy WebSocket subscriptions for escrow events

---
