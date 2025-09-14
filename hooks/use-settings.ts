"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useSettings() {
  const [settings, setSettings] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("settings").select("*");
    if (!error && data) {
      const obj: any = {};
      data.forEach((row: any) => { obj[row.key] = row.value });
      setSettings(obj);
    }
    setLoading(false);
  };

  const updateSetting = async (key: string, value: string) => {
    await supabase.from("settings").upsert({ key, value });
    await loadSettings();
  };

  useEffect(() => { loadSettings() }, []);

  return { settings, loading, updateSetting };
}
