"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

const SubscriptionButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      className="mt-2 text-white bg-slate-700"
      disabled={loading}
      onClick={handleSubscription}
    >
      Upgrade to Pro
    </Button>
  );
};

export default SubscriptionButton;
