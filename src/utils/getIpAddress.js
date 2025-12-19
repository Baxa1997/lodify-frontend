import React, {useEffect, useState} from "react";

function IPAddressFinder() {
  const [ip, setIp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setIp(data.ip);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIpAddress();
  }, []);

  return {
    ip,
  };
}

export default IPAddressFinder;
