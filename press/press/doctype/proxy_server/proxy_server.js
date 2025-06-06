// Copyright (c) 2020, Frappe and contributors
// For license information, please see license.txt

frappe.ui.form.on('Proxy Server', {
	refresh: function (frm) {
		[
			[__('Ping Agent'), 'ping_agent', false, frm.doc.is_server_setup],
			[__('Ping Ansible'), 'ping_ansible', true],
			[__('Ping Ansible Unprepared'), 'ping_ansible_unprepared', true],
			[__('Update Agent'), 'update_agent', true, frm.doc.is_server_setup],
			[
				__('Update Agent Ansible'),
				'update_agent_ansible',
				true,
				frm.doc.is_server_setup,
			],
			[
				__('Install Filebeat'),
				'install_filebeat',
				true,
				frm.doc.is_server_setup,
			],
			[__('Prepare Server'), 'prepare_server', true, !frm.doc.is_server_setup],
			[__('Setup Server'), 'setup_server', true, !frm.doc.is_server_setup],
			[
				__('Setup SSH Proxy'),
				'setup_ssh_proxy',
				true,
				frm.doc.ssh_certificate_authority && !frm.doc.is_ssh_proxy_setup,
			],
			[
				__('Setup ProxySQL'),
				'setup_proxysql',
				true,
				!frm.doc.is_proxysql_setup,
			],
			[
				__('Setup ProxySQL Monitor'),
				'setup_proxysql_monitor',
				true,
				frm.doc.is_proxysql_setup,
			],
			[
				__('Setup Wildcard Hosts'),
				'setup_wildcard_hosts',
				true,
				frm.doc.is_server_setup,
			],
			[
				__('Show Agent Password'),
				'show_agent_password',
				false,
				frm.doc.is_server_setup,
			],
			[
				__('Fetch Keys'),
				'fetch_keys',
				false,
				frm.doc.is_server_setup &&
					(!frm.doc.frappe_public_key || !frm.doc.root_public_key),
			],
			[__('Update TLS Certificate'), 'update_tls_certificate', true],
			[__('Reload NGINX'), 'reload_nginx', true, frm.doc.is_server_setup],
			[__('Create Image'), 'create_image', true, frm.doc.status == 'Active'],
			[
				__('Setup Replication'),
				'setup_replication',
				true,
				frm.doc.is_server_setup &&
					!frm.doc.is_primary &&
					!frm.doc.is_replication_setup,
			],
			[
				__('Trigger Failover'),
				'trigger_failover',
				true,
				frm.doc.is_server_setup &&
					!frm.doc.is_primary &&
					frm.doc.is_replication_setup,
			],
			[__('Archive'), 'archive', true, frm.doc.status !== 'Archived'],
			[__('Setup Fail2ban'), 'setup_fail2ban', true, frm.doc.is_server_setup],
			[__('Setup Wireguard'), 'setup_wireguard', true],
			[__('Reload Wireguard'), 'reload_wireguard', true],
			[
				__('Reboot with serial console'),
				'reboot_with_serial_console',
				true,
				frm.doc.virtual_machine,
			],
		].forEach(([label, method, confirm, condition]) => {
			if (typeof condition === 'undefined' || condition) {
				frm.add_custom_button(
					label,
					() => {
						if (confirm) {
							frappe.confirm(
								`Are you sure you want to ${label.toLowerCase()}?`,
								() =>
									frm.call(method).then((r) => {
										if (r.message) {
											frappe.msgprint(r.message);
										} else {
											frm.refresh();
										}
									}),
							);
						} else {
							frm.call(method).then((r) => {
								if (r.message) {
									frappe.msgprint(r.message);
								} else {
									frm.refresh();
								}
							});
						}
					},
					__('Actions'),
				);
			}
		});
	},

	hostname: function (frm) {
		press.set_hostname_abbreviation(frm);
	},
});
