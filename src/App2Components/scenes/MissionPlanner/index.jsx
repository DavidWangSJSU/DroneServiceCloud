import React from'react';

function MissionPlanner({ serviceType, droneId, tenantId, missionId, waypointItems }) {
  console.log(serviceType);
  console.log(droneId);
  console.log(tenantId);
  console.log(missionId);
  // You might want to encode the parameters to ensure they are URL-safe.
  const serviceTypeEncoded = encodeURIComponent(serviceType);
  const droneIdEncoded = encodeURIComponent(droneId);
  const tenantIdEncoded = encodeURIComponent(tenantId);
  const missionIdEncoded = encodeURIComponent(missionId);
  const waypointItemsEncoded = encodeURIComponent(waypointItems);

  // Modify the src URL to include the serviceType and droneId as query parameters.
  const iframeSrc = `my-app1.html?serviceType=${serviceTypeEncoded}&droneId=${droneIdEncoded}&tenantId=${tenantIdEncoded}&missionId=${missionIdEncoded}&waypointItems=${waypointItemsEncoded}`;
  console.log(serviceTypeEncoded);
  console.log(droneIdEncoded);
  console.log(tenantIdEncoded);
  console.log(missionIdEncoded);
  console.log(waypointItemsEncoded);
  return (
    <div>
      <iframe 
        id="myFrame"
        src={iframeSrc}
        width="100%" 
        height={960}
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}

export default MissionPlanner;