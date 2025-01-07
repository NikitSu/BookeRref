"use client";

import { useEffect, useState } from "react";
import ReferralSystem from "@/components/ReferralSystem";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [initData, setInitData] = useState("");
  const [userId, setUserId] = useState("");
  const [startParam, setStartParam] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function initWebApp() {
      if (typeof window !== "undefined") {
        const WebApp = (await import("@twa-dev/sdk")).default;
        WebApp.ready();

        // Сохраним initData, userId, startParam
        setInitData(WebApp.initData);
        const uid = WebApp.initDataUnsafe.user?.id.toString() || "";
        setUserId(uid);

        const param = WebApp.initDataUnsafe.start_param || "";
        setStartParam(param);

        // Заполним userData для отображения в интерфейсе
        if (WebApp.initDataUnsafe.user) {
          setUserData(WebApp.initDataUnsafe.user as UserData);
        }
      }
    }

    initWebApp();
  }, []);

  return (
    <main className="p-4">
      {userData ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Telegram Referral Demo</h1>
          <ul>
            <li>ID: {userData.id}</li>
            <li>First Name: {userData.first_name}</li>
            <li>Last Name: {userData.last_name}</li>
            <li>Username: {userData.username}</li>
            <li>Language Code: {userData.language_code}</li>
            <li>Is Premium: {userData.is_premium ? "Yes" : "No"}</li>
          </ul>

          {/* Подключаем компонент, который отобразит рефссылки, список рефералов и т. д. */}
          <ReferralSystem
            initData={initData}
            userId={userId}
            startParam={startParam}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
