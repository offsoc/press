# Copyright (c) 2021, Frappe and Contributors
# See license.txt

import unittest
from unittest.mock import Mock, patch

import frappe

from press.agent import Agent
from press.press.doctype.prometheus_alert_rule.prometheus_alert_rule import PrometheusAlertRule


@patch.object(Agent, "update_monitor_rules", new=Mock())
def create_test_prometheus_alert_rule(name="Sites Down") -> PrometheusAlertRule:
	return frappe.get_doc(  # type: ignore
		{
			"doctype": "Prometheus Alert Rule",
			"name": name,
			"description": "Sites didn't respond with http 200",
			"severity": "Critical",
			"group_wait": "1m",
			"group_interval": "1m",
			"repeat_interval": "1h",
			"group_by": '["alertname", "cluster", "server", "instance"]',
			"expression": 'probe_success{job="site"} == 0 and probe_http_status_code != 429',
			"for": "4m",
			"enable_reactions": True,
		},
	).insert(ignore_if_duplicate=True)


class TestPrometheusAlertRule(unittest.TestCase):
	pass
