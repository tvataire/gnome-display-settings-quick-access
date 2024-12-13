/*
 * A Gnome extension to provide quick access to the display settings in the Gnome control center.
 * 
 * Copyright (C) 2024 Thibault Vataire
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use strict";

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Button = imports.ui.panelMenu.Button;
const extensionUtils = imports.misc.extensionUtils;
const St = imports.gi.St;
const main = imports.ui.main;

const DisplaySettings = GObject.registerClass(
	{GTypeName: 'DisplaySettings'},
    class extends   Button {

	_init() {
		super._init(0.0, `${extensionUtils.getCurrentExtension().metadata.name} panel button`, false);
		this.__icon = new St.Icon({icon_name: 'preferences-desktop-display-symbolic',
		                           style_class: 'system-status-icon'});
        this.add_child(this.__icon);
	}

	clicked() {
		GLib.spawn_async(null, ["gnome-control-center", "display"], null, GLib.SpawnFlags.SEARCH_PATH, null);
	}

	destroy() {
        this.remove_child(this.__icon);
		this.__icon.destroy();
		this.__icon = null;
		super.destroy();
	}
});

class DisplaySettingsExtension {

    enable() {
        this.__display_settings = new DisplaySettings();
        this.__handleId = this.__display_settings.connect('button-press-event', this.__display_settings.clicked);
        main.panel.addToStatusArea("pop-display-settings", this.__display_settings);
    }

    disable() {
        this.__display_settings.disconnect(this.__handleId);
        this.__handleId = null;
        this.__display_settings.destroy();
        this.__display_settings = null;
    }
}

function init() {
    return new DisplaySettingsExtension();
}
