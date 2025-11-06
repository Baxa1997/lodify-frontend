import { useState } from "react";
import styles from "./AdminPages.module.scss";

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: "Lodify Admin",
    siteDescription: "Admin panel for Lodify",
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    allowRegistration: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // Simulate saving settings
    alert("Settings saved successfully!");
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Configure your application settings and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <div className="section-header">
            <h3>General Settings</h3>
            <p>Basic application configuration</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                placeholder="Enter site name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="siteDescription">Site Description</label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                placeholder="Enter site description"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowRegistration"
                  checked={settings.allowRegistration}
                  onChange={handleInputChange}
                />
                <span>Allow user registration</span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h3>Notification Settings</h3>
            <p>Configure how you receive notifications</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                />
                <span>Email notifications</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={handleInputChange}
                />
                <span>SMS notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h3>System Settings</h3>
            <p>Advanced system configuration</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleInputChange}
                />
                <span>Maintenance mode</span>
              </label>
              <small>Enable this to put your site in maintenance mode</small>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button
            className="primary-btn"
            onClick={handleSave}>
            Save Settings
          </button>
          <button className="secondary-btn">Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
