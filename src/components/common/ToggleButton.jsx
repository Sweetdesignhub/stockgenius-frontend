/**
 * File: ToggleButton
 * Description: A toggle switch component for changing between light and dark themes. It utilizes `@headlessui/react` for accessibility and integrates with a custom theme context to manage and persist theme state across the application. The toggle button reflects the current theme on load and animates the transition when toggled.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ToggleButton() {
  const { theme, updateTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme === "dark");

  useEffect(() => {
    setEnabled(theme === "dark");
  }, [theme]);

  const handleToggle = () => {
    const newTheme = enabled ? "light" : "dark";
    setEnabled(!enabled);
    updateTheme(newTheme);
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleToggle}
      className={`group relative flex flex-col h-11 w-6 cursor-pointer rounded-full theme-changer p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-white" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform ease-in-out ${
          enabled ? "rotate-90 translate-y-5" : "rotate-90 translate-y-0"
        }`}
      />
    </Switch>
  );
}
