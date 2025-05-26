/**
 * File: GroupTab
 * Description: This component displays a "Coming Soon" popup for the GroupTab feature, indicating that it is not yet available. It uses the ComingSoon component to show a customizable message with a countdown timer.
 *
 * Developed by: [Your Name]
 * Developed on: 2025-05-26
 * Updated by: [Your Name]
 * Updated on: 2025-05-26
 * - Update description: Updated to use popup-style ComingSoon component for proper viewport centering.
 */

import React from "react";
import ComingSoon from "../../components/common/ComingSoon";

function GroupTab() {
  return (
    <ComingSoon
      description="This feature is under development and will be available soon. Stay tuned for exciting updates!"
    />
  );
}

export default GroupTab;